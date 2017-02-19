import {Component, OnInit, EventEmitter, QueryList, OnChanges, Input, SimpleChange, ViewChild, ViewChildren, OnDestroy, ElementRef, AfterViewInit } from '@angular/core';
import {FunctionsService} from '../shared/services/functions.service';
import {FunctionInfo} from '../shared/models/function-info';
import {VfsObject} from '../shared/models/vfs-object';
import {FunctionDesignerComponent} from '../function-designer/function-designer.component';
import {LogStreamingComponent} from '../log-streaming/log-streaming.component';
import {FunctionConfig} from '../shared/models/function-config';
import {Observable, Subject, Subscription} from 'rxjs/Rx';
import {FunctionSecrets} from '../shared/models/function-secrets';
import {BroadcastService} from '../shared/services/broadcast.service';
import {BroadcastEvent} from '../shared/models/broadcast-event';
import {PortalService} from '../shared/services/portal.service';
import {BindingType} from '../shared/models/binding';
import {RunFunctionResult} from '../shared/models/run-function-result';
import {FileExplorerComponent} from '../file-explorer/file-explorer.component';
import {GlobalStateService} from '../shared/services/global-state.service';
import {BusyStateComponent} from '../busy-state/busy-state.component';
import {ErrorEvent} from '../shared/models/error-event';
import {TranslateService, TranslatePipe} from 'ng2-translate/ng2-translate';
import {PortalResources} from '../shared/models/portal-resources';
import {TutorialEvent, TutorialStep} from '../shared/models/tutorial';
import {AiService} from '../shared/services/ai.service';
import {MonacoEditorDirective} from '../shared/directives/monaco-editor.directive';
import {BindingManager} from '../shared/models/binding-manager';
import {RunHttpComponent} from '../run-http/run-http.component';


@Component({
  selector: 'function-dev',
  templateUrl: './function-dev.component.html',
  styleUrls: ['./function-dev.component.css']
})
export class FunctionDevComponent implements OnChanges, OnDestroy {
    @ViewChild(FileExplorerComponent) fileExplorer: FileExplorerComponent;
    @ViewChild(RunHttpComponent) runHttp: RunHttpComponent;
    @ViewChildren(BusyStateComponent) BusyStates: QueryList<BusyStateComponent>;
    @ViewChildren(MonacoEditorDirective) monacoEditors: QueryList<MonacoEditorDirective>;
    @ViewChildren(LogStreamingComponent) logStreamings: QueryList<LogStreamingComponent>;

    @ViewChild('functionContainer') functionContainer: ElementRef;
    @ViewChild('editorContainer') editorContainer: ElementRef;
    @ViewChild('rightContainer') rightContainer: ElementRef;
    @ViewChild('bottomContainer') bottomContainer: ElementRef;

    @Input() selectedFunction: FunctionInfo;
    public disabled: boolean;
    public functionInfo: FunctionInfo;
    public functionUpdate: Subscription;
    public scriptFile: VfsObject;
    public content: string;
    public testContent: string;
    public fileName: string;
    public inIFrame: boolean;
    public runValid: boolean;

    public configContent: string;
    public webHookType: string;
    public authLevel: string;
    public secrets: FunctionSecrets;
    public isHttpFunction: boolean;

    public runResult: RunFunctionResult;
    public running: Subscription;
    public showFunctionInvokeUrl: boolean = false;

    public rightTab: string = FunctionDevComponent.rightTab;
    public bottomTab: string = FunctionDevComponent.bottomTab;
    public static rightTab: string;
    public static bottomTab: string;
    public functionInvokeUrl: string = " ";
    public expandLogs: boolean = false;

    private updatedContent: string;
    private updatedTestContent: string;
    private functionSelectStream: Subject<FunctionInfo>;
    private selectedFileStream: Subject<VfsObject>;
    private selectedKeyStream: Subject<string>;
    private autoSelectAdminKey: boolean;
    private functionKey: string;
    private _bindingManager = new BindingManager();

    constructor(private _functionsService: FunctionsService,
        private _broadcastService: BroadcastService,
        private _portalService: PortalService,
        private _globalStateService: GlobalStateService,
        private _translateService: TranslateService,
        private _aiService: AiService,
        private _el: ElementRef) {

        this.selectedFileStream = new Subject<VfsObject>();
        this.selectedFileStream
            .switchMap(file => {
                if (this.fileExplorer)
                    this.fileExplorer.setBusyState();
                return Observable.zip(this._functionsService.getFileContent(file), Observable.of(file), (c, f) => ({ content: c, file: f }));
            })
            .subscribe((res: { content: string, file: VfsObject }) => {
                this.content = res.content;
                this.updatedContent = res.content;
                res.file.isDirty = false;
                this.scriptFile = res.file;
                this.fileName = res.file.name;
                if (this.fileExplorer)
                    this.fileExplorer.clearBusyState();
            }, e => this._globalStateService.clearBusyState());

        this.functionSelectStream = new Subject<FunctionInfo>();
        this.functionSelectStream
            .distinctUntilChanged()
            .switchMap(fi => {
                this.disabled = _broadcastService.getDirtyState("function_disabled");
                this._globalStateService.setBusyState();
                this.checkErrors(fi);
                return Observable.zip(
                    fi.clientOnly || this._functionsService.isMultiKeySupported ? Observable.of({}) : this._functionsService.getSecrets(fi),
                    this._functionsService.getFunction(fi),
                    (s, f) => ({ secrets: s, functionInfo: f }))
            })
            .subscribe((res: { secrets: any, functionInfo: FunctionInfo }) => {
                this.content = "";
                this.testContent = res.functionInfo.test_data;
                this.runValid = true;
                try {
                    var httpModel = JSON.parse(res.functionInfo.test_data);
                    if (httpModel.body !== undefined) {
                        this.testContent = httpModel.body;
                    }
                } catch (e) {
                    // it's not run http model
                }

                this._globalStateService.clearBusyState();
                this.fileName = res.functionInfo.script_href.substring(res.functionInfo.script_href.lastIndexOf('/') + 1);
                var href = res.functionInfo.script_href;
                if (this.fileName.toLowerCase().endsWith("dll")) {
                    this.fileName = res.functionInfo.config_href.substring(res.functionInfo.config_href.lastIndexOf('/') + 1);
                    href = res.functionInfo.config_href;
                }

                this.scriptFile = this.scriptFile && this.functionInfo && this.functionInfo.href === res.functionInfo.href
                    ? this.scriptFile
                    : { name: this.fileName, href: href, mime: 'file' };
                this.selectedFileStream.next(this.scriptFile);
                this.functionInfo = res.functionInfo;
                this.setInvokeUrlVisibility();

                this.configContent = JSON.stringify(this.functionInfo.config, undefined, 2);

                var inputBinding = (this.functionInfo.config && this.functionInfo.config.bindings
                    ? this.functionInfo.config.bindings.find(e => !!e.webHookType)
                    : null);
                if (inputBinding) {
                    this.webHookType = inputBinding.webHookType;
                } else {
                    delete this.webHookType;
                }

                inputBinding = (this.functionInfo.config && this.functionInfo.config.bindings
                    ? this.functionInfo.config.bindings.find(e => !!e.authLevel)
                    : null);
                if (inputBinding) {
                    this.authLevel = inputBinding.authLevel;
                } else {
                    delete this.authLevel;
                }

                inputBinding = (this.functionInfo.config && this.functionInfo.config.bindings
                    ? this.functionInfo.config.bindings.find(e => e.type === 'httpTrigger')
                    : null);
                if (inputBinding) {
                    this.isHttpFunction = true;
                } else {
                    this.isHttpFunction = false;
                }

                setTimeout(() => {
                    this.onResize();
                }, 0);

                if (!this._functionsService.isMultiKeySupported) {
                    this.createSecretIfNeeded(res.functionInfo, res.secrets);
                    this.setFunctionInvokeUrl();
                    this.setFunctionKey(this.functionInfo);
                }
            });

        this.functionUpdate = _broadcastService.subscribe(BroadcastEvent.FunctionUpdated, (newFunctionInfo: FunctionInfo) => {
            this.functionInfo.config = newFunctionInfo.config;
            this.setInvokeUrlVisibility();
        });

        this.selectedKeyStream = new Subject<string>();
        this.selectedKeyStream
            .subscribe(key => {
                if (this.authLevel && this.authLevel.toLowerCase() === "admin") {
                    this.autoSelectAdminKey = true;
                }

                if (key) {
                    this.setFunctionInvokeUrl(key);
                    this.setFunctionKey(this.functionInfo);
                }
            });
    }

    expandLogsClicked(isExpand: boolean) {
        this.expandLogs = isExpand;
        this.onResize();
    }

    private onResize(ev?: any) {
        var warningTopBarHeight = 39;
        var functionNameHeight = 46;
        var editorPadding = 25;

        var functionContainerWidth;
        var functionContainaerHeight;
        if (this.functionContainer) {
            functionContainerWidth = window.innerWidth - this.functionContainer.nativeElement.getBoundingClientRect().left;
            functionContainaerHeight = window.innerHeight - this.functionContainer.nativeElement.getBoundingClientRect().top;
        }
        var rigthContainerWidth = this.rightTab ? Math.floor((functionContainerWidth / 3)) : 50;
        var bottomContainerHeight = this.bottomTab ? Math.floor((functionContainaerHeight / 3)) : 50;

        var editorContainerWidth = functionContainerWidth - rigthContainerWidth - 50;
        var editorContainerHeight = functionContainaerHeight - bottomContainerHeight - functionNameHeight - editorPadding;

        if (this.expandLogs) {
            editorContainerHeight = 0;
            //editorContainerWidth = 0;

            bottomContainerHeight = functionContainaerHeight - functionNameHeight;

            this.editorContainer.nativeElement.style.visibility = "hidden";
            this.bottomContainer.nativeElement.style.marginTop = "0px";
        } else {
            this.editorContainer.nativeElement.style.visibility = "visible";
            this.bottomContainer.nativeElement.style.marginTop = "25px";
        }


        if (this.editorContainer) {            
            this.editorContainer.nativeElement.style.width = editorContainerWidth + "px";
            this.editorContainer.nativeElement.style.height = editorContainerHeight + "px";
        }

        if (this.codeEditor) {
            this.codeEditor.setLayout(
                editorContainerWidth - 2,
                editorContainerHeight - 2
            );
        }

        if (this.rightContainer) {
            this.rightContainer.nativeElement.style.width = rigthContainerWidth + "px";
        }

        if (this.bottomContainer) {
            this.bottomContainer.nativeElement.style.height = bottomContainerHeight + "px";
            this.bottomContainer.nativeElement.style.width = (editorContainerWidth + editorPadding * 2) + "px";
        }

        if (this.testDataEditor) {
            var widthDataEditor = rigthContainerWidth - 34;

            setTimeout(() => {
                this.testDataEditor.setLayout(
                    this.rightTab ? widthDataEditor : 0,
                    this.isHttpFunction ? 150 : functionContainaerHeight / 2
                )
            }, 0);
        }
    }

    clickRightTab(tab: string) {
        if (tab === "logs") {
            if (this.bottomTab === tab) {
                this.bottomTab = "";
                this.expandLogs = false;
                if (this.runLogs) {
                    this.runLogs.compress();
                }
            } else {
                this.bottomTab = tab;
            }
        } else {
            this.rightTab = (this.rightTab === tab) ? "" : tab;
        }

        // double resize to fix pre heigth
        this.onResize();
        setTimeout(() => {
            this.onResize();
        }, 0);
    }

    private createSecretIfNeeded(fi: FunctionInfo, secrets: FunctionSecrets) {
        if (!secrets.key) {
            if (this.isHttpFunction) {
                //http://stackoverflow.com/a/8084248/3234163
                let secret = '';
                do {
                    secret = Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2);
                } while (secret.length < 32 || secret.length > 128);
                this._functionsService.setSecrets(fi, { key: secret })
                    .subscribe(r => this.secrets = r);
            } else {
                this.secrets = secrets;
            }
        } else {
            this.secrets = secrets;
        }
    }

    ngOnDestroy() {
        this.functionUpdate.unsubscribe();
        this.selectedFileStream.unsubscribe();
        this.functionSelectStream.unsubscribe();
        if (this.logStreamings) {
            this.logStreamings.toArray().forEach((ls) => {
                ls.ngOnDestroy();
            });
        }
        FunctionDevComponent.rightTab = this.rightTab;
        FunctionDevComponent.bottomTab = this.bottomTab;
    }

    ngAfterContentInit() {
        this._broadcastService.broadcast<TutorialEvent>(
            BroadcastEvent.TutorialStep,
            {
                functionInfo: null,
                step: TutorialStep.Develop
            });
    }

    private setInvokeUrlVisibility() {
        var b = this.functionInfo.config.bindings.find((b) => {
            return b.type === BindingType.httpTrigger.toString();
        });
        this.showFunctionInvokeUrl = b ? true : false;
    }

    ngOnChanges(changes: { [key: string]: SimpleChange }) {
        if (changes['selectedFunction']) {
            delete this.updatedTestContent;
            delete this.runResult;
            this.functionSelectStream.next(changes['selectedFunction'].currentValue);
        }
    }

    private setFunctionKey(functionInfo) {
        if (functionInfo) {
            this._functionsService.getFunctionKeys(functionInfo)
                .subscribe(keys => {
                    if (keys && keys.keys && keys.keys.length > 0) {
                        this.functionKey = keys.keys.find(k => k.name === "default").value || keys.keys[0].value;
                    }
                });
        }
    }

    private setFunctionInvokeUrl(key?: string) {
        setTimeout(() => {
            this.functionInvokeUrl = this._translateService.instant(PortalResources.functionDev_loading);
        });

        if (this.isHttpFunction) {
            var code = '';
            if (this.webHookType === 'github' || this.authLevel === 'anonymous') {
                code = '';
            } else if (key) {
                code = `?code=${key}`;
            } else if (this.isHttpFunction && this.secrets && this.secrets.key) {
                code = `?code=${this.secrets.key}`;
            } else if (this.isHttpFunction && this._functionsService.HostSecrets) {
                code = `?code=${this._functionsService.HostSecrets}`;
            }

            this._functionsService.getHostJson().subscribe((jsonObj) => {
                var that = this;
                var result = (jsonObj && jsonObj.http && jsonObj.http.routePrefix !== undefined && jsonObj.http.routePrefix !== null) ? jsonObj.http.routePrefix : 'api';
                var httpTrigger = this.functionInfo.config.bindings.find((b) => {
                    return b.type === BindingType.httpTrigger.toString();
                });
                if (httpTrigger && httpTrigger.route) {
                    result = result + '/' + httpTrigger.route;
                } else {
                    result = result + '/' + this.functionInfo.name;
                }

                // Remove doubled slashes
                var path = '/' + result + code;
                var find = '//';
                var re = new RegExp(find, 'g');
                path = path.replace(re, '/');
                path = path.replace('/?', '?');

                setTimeout(() => {
                    this.functionInvokeUrl = this._functionsService.getMainSiteUrl() + path;
                });

            });
        }
    }

    saveScript(dontClearBusy?: boolean) {
        // Only save if the file is dirty
        if (!this.scriptFile.isDirty) return;
        if (this.scriptFile.href.toLocaleLowerCase() === this.functionInfo.config_href.toLocaleLowerCase()) {
            try {
                this._bindingManager.validateConfig(JSON.parse(this.updatedContent), this._translateService);
            } catch (e) {
                this._broadcastService.broadcast<ErrorEvent>(BroadcastEvent.Error, { message: this._translateService.instant(PortalResources.errorParsingConfig, { error: e }) })
                return;
            }
        }
        this._globalStateService.setBusyState();

        if (this.scriptFile.name.toLowerCase() === "function.json") {
            this.functionInfo.config = JSON.parse(this.updatedContent);
        }

        return this._functionsService.saveFile(this.scriptFile, this.updatedContent, this.functionInfo)
            .subscribe(r => {
                if (!dontClearBusy)
                    this._globalStateService.clearBusyState();
                if (typeof r !== 'string' && r.isDirty) {
                    r.isDirty = false;
                    this._broadcastService.clearDirtyState('function');
                    this._portalService.setDirtyState(false);
                }
                this.content = this.updatedContent;
            });
    }

    contentChanged(content: string) {


        if (!this.scriptFile.isDirty) {
            this.scriptFile.isDirty = true;
            this._broadcastService.setDirtyState('function');
            this._portalService.setDirtyState(true);
        }
        this.updatedContent = content;
    }

    testContentChanged(content: string) {
        this.updatedTestContent = content;
    }

    saveTestData() {
        var test_data = this.getTestData();
        if (this.functionInfo.test_data !== test_data) {
            this.functionInfo.test_data = test_data;
            this._functionsService.updateFunction(this.functionInfo)
                .subscribe(r => Object.assign(this.functionInfo, r));
        }
    }

    runFunction() {
        if (!this.runValid) {
            return;
        }

        if (this.bottomTab !== "logs") {
            this.bottomTab = "logs";
            this.onResize();
        }
        var busyComponent = this.BusyStates.toArray().find(e => e.name === 'run-busy');
        busyComponent.setBusyState();

        this.saveTestData();

        if (this.runHttp) {
            if (!this.runHttp.valid) {
                return;
            }

            this.httpRunLogs.clearLogs();
            this.runFunctionInternal(busyComponent);

        } else {
            this.runFunctionInternal(busyComponent);
        }

    }

    cancelCurrentRun() {
        this.BusyStates.toArray().find(e => e.name === 'run-busy').clearBusyState();
        if (this.running) {
            this.running.unsubscribe();
            delete this.running;
        }
    }

    checkErrors(functionInfo: FunctionInfo) {
        this._functionsService.getFunctionErrors(functionInfo)
            .subscribe(errors => {
                if (errors) {
                    errors.forEach(e => {
                        this._broadcastService.broadcast<ErrorEvent>(BroadcastEvent.Error, {
                            message: this._translateService.instant(PortalResources.functionDev_functionErrorMessage, { name: functionInfo.name, error: e }),
                            details: this._translateService.instant(PortalResources.functionDev_functionErrorDetails, { error: e })
                        });
                        this._aiService.trackEvent('/errors/function', { error: e, functionName: functionInfo.name, functionConfig: JSON.stringify(functionInfo.config) });
                    });
                } else {
                    this._functionsService.getHostErrors()
                        .subscribe(errors => errors.forEach(e => {
                            this._broadcastService.broadcast<ErrorEvent>(BroadcastEvent.Error, {
                                message: this._translateService.instant(PortalResources.functionDev_hostErrorMessage, { error: e }),
                                details: this._translateService.instant(PortalResources.functionDev_hostErrorMessage, { error: e })
                            });
                            this._aiService.trackEvent('/errors/host', { error: e, app: this._globalStateService.FunctionContainer.id });
                        }));
                }
            });
    }

    get codeEditor(): MonacoEditorDirective {
        return this.getMonacoDirective("code");
    }

    get testDataEditor(): MonacoEditorDirective {
        return this.getMonacoDirective("test_data");
    }

    get runLogs(): LogStreamingComponent {
        if (!this.logStreamings) {
            return null;
        }

        return this.logStreamings.toArray().find((l) => {
            return l.isHttpLogs !== true;
        });
    }

    get httpRunLogs(): LogStreamingComponent {
        if (!this.logStreamings) {
            return null;
        }

        return this.logStreamings.toArray().find((l) => {
            return l.isHttpLogs === true;
        });
    }

    onRunValid(runValid: any) {
        this.runValid = runValid;
    }

    private getTestData(): string {
        if (this.runHttp) {
            this.runHttp.model.body = this.updatedTestContent !== undefined ? this.updatedTestContent : this.runHttp.model.body;
            return JSON.stringify(this.runHttp.model);
        } else {
            return this.updatedTestContent !== undefined ? this.updatedTestContent : this.functionInfo.test_data;
        }
    }

    private getMonacoDirective(id: string): MonacoEditorDirective {

        if (!this.monacoEditors) {
            return null;
        }

        return this.monacoEditors.toArray().find((e) => {
            return e.elementRef.nativeElement.id === id;
        });
    }

    private runFunctionInternal(busyComponent: BusyStateComponent) {

        if (this.scriptFile.isDirty) {
            this.saveScript().add(() => setTimeout(() => this.runFunction(), 1000));
        } else {
            var testData = this.getTestData();

            var result = (this.runHttp) ? this._functionsService.runHttpFunction(this.functionInfo, this.functionInvokeUrl, this.runHttp.model) :
                this._functionsService.runFunction(this.functionInfo, this.getTestData());

            this.running = result.subscribe(r => {
                this.runResult = r;
                busyComponent.clearBusyState();
                delete this.running;
                if (this.runResult.statusCode >= 400) {
                    this.checkErrors(this.functionInfo);
                }
            });
        }
    }
}
