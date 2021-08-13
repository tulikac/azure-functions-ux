import { IPalette } from 'office-ui-fabric-react/lib/Styling';
import { ThemeExtended } from './SemanticColorsExtended';

export const AzurePortalColors = {
  lineSeparator: 'rgba(107, 132, 156, 0.25)',
  sectionDividerScrollbar: 'rgba(107, 132, 156, 0.35)',
  background: '#ffffff',
  sectionBackground: 'rgba(107, 132, 156, 0.06)',
  itemBackgroundOnSelect: 'rgba(85, 179, 255, 0.2)',
  itemBackgroundOnHover: 'rgba(85, 179, 255, 0.1)',
  overlay: 'rgba(0, 0, 0, 0.6)',
  successText: '#428000',
  successBackground: '#e6ffcc',
  successIcon: '#5db300',
  errorText: '#A4262C',
  errorBackground: '#fdd8db',
  errorIcon: '#e00b1c',
  warningBackground: '#ffdfb8',
  warningIcon: '#ff8c00',
  infoBackground: '#cce1ff',
  infoIcon: '#605e5c',
  monochromaticIcon: '#636363',
  textColor: '#161616',
  placeholderText: '#595959',
  labelText: '#747474',
  disabledText: 'rgba(128, 128, 128, 0.7)',
  disabledControlBackground: 'rgba(128, 128, 128, 0.1)',
  hyperlinkText: '#015cda',
  hyperlinkHoverText: '#004578',
  inlineSuccessText: '#428000',
  inlineErrorText: '#e00b1c',
  buttonRest: '#015cda',
  buttonHovered: '#016afe',
  buttonPressed: '#014db7',
  buttonDisabled: '#rgba(128, 128, 128, 0.1)',
  textControlOutlineRest: '#808080',
  textControlOutlineHovered: '#rgba(128, 128, 128, 0.7)',
  standardControlOutlineRest: '#808080',
  standardControlOutlineDisabled: '#rgba(128, 128, 128, 0.7)',
  standardControlOutlineHover: '#161616',
  standardControlOutlineAccent: '#015cda',
  controlErrorStateOutline: '#e00b1c',
  controlDirtyOutline: '#8a2da5',
  cardBorderColor: '#b2b2b2',
  cardBackgroundColor: '#ffffff',
};

const themePalette: IPalette = {
  themeDarker: '#004578',
  themeDark: '#005a9e',
  themeDarkAlt: '#106ebe',
  themePrimary: '#0078d4',
  themeSecondary: '#2b88d8',
  themeTertiary: '#71afe5',
  themeLight: '#c7e0f4',
  themeLighter: '#deecf9',
  themeLighterAlt: '#eff6fc',
  black: '#000000',
  blackTranslucent40: 'rgba(0,0,0,.4)',
  neutralDark: '#212121',
  neutralPrimary: '#333333',
  neutralPrimaryAlt: '#3c3c3c',
  neutralSecondary: '#666666',
  neutralSecondaryAlt: 'rgba(244,244,244)',
  neutralTertiary: '#a6a6a6',
  neutralTertiaryAlt: '#c8c8c8',
  neutralQuaternary: '#d0d0d0',
  neutralQuaternaryAlt: '#dadada',
  neutralLight: '#eaeaea',
  neutralLighter: '#f4f4f4',
  neutralLighterAlt: '#f8f8f8',
  accent: '#0078d4',
  white: '#ffffff',
  whiteTranslucent40: 'rgba(255,255,255,.4)',
  yellowDark: '#d29200',
  yellow: '#ffb900',
  yellowLight: '#fff100',
  orange: '#d83b01',
  orangeLight: '#ea4300',
  orangeLighter: '#ff8c00',
  redDark: '#a80000',
  red: '#e81123',
  magentaDark: '#5c005c',
  magenta: '#b4009e',
  magentaLight: '#e3008c',
  purpleDark: '#32145a',
  purple: '#5c2d91',
  purpleLight: '#b4a0ff',
  blueDark: '#002050',
  blueMid: '#00188f',
  blue: '#0078d4',
  blueLight: '#00bcf2',
  tealDark: '#004b50',
  teal: '#008272',
  tealLight: '#00b294',
  greenDark: '#004b1c',
  green: '#107c10',
  greenLight: '#bad80a',
};

const semanticColors = {
  bodyBackground: AzurePortalColors.background,
  bodyStandoutBackground: AzurePortalColors.sectionBackground,
  bodyFrameBackground: AzurePortalColors.background,
  bodyFrameDivider: AzurePortalColors.sectionDividerScrollbar,
  bodyText: AzurePortalColors.textColor,
  bodyTextChecked: AzurePortalColors.textColor,
  bodySubtext: AzurePortalColors.textColor,
  bodyDivider: AzurePortalColors.sectionDividerScrollbar,

  disabledBackground: AzurePortalColors.buttonDisabled,
  disabledText: AzurePortalColors.disabledText,
  disabledBodyText: AzurePortalColors.disabledText,
  disabledSubtext: AzurePortalColors.disabledText,

  focusBorder: AzurePortalColors.standardControlOutlineAccent,
  variantBorder: AzurePortalColors.standardControlOutlineAccent,
  variantBorderHovered: AzurePortalColors.standardControlOutlineHover,
  defaultStateBackground: AzurePortalColors.standardControlOutlineDisabled,

  errorText: AzurePortalColors.inlineErrorText,
  warningText: AzurePortalColors.textColor,
  errorBackground: AzurePortalColors.errorBackground,
  blockingBackground: AzurePortalColors.errorBackground,
  warningBackground: AzurePortalColors.warningBackground,
  warningHighlight: AzurePortalColors.warningIcon,
  successBackground: AzurePortalColors.successBackground,

  inputBorder: AzurePortalColors.textControlOutlineRest,
  inputBorderHovered: AzurePortalColors.textControlOutlineHovered,
  inputBackground: AzurePortalColors.background,
  inputBackgroundChecked: AzurePortalColors.buttonRest, // this is not used for backgrounds in fabric
  inputBackgroundCheckedHovered: AzurePortalColors.buttonHovered,
  inputForegroundChecked: AzurePortalColors.background,
  inputFocusBorderAlt: AzurePortalColors.standardControlOutlineAccent,
  smallInputBorder: AzurePortalColors.standardControlOutlineRest,
  inputPlaceholderText: AzurePortalColors.placeholderText,

  buttonBackground: AzurePortalColors.background,
  buttonBackgroundChecked: AzurePortalColors.buttonPressed,
  buttonBackgroundHovered: AzurePortalColors.buttonHovered,
  buttonBackgroundCheckedHovered: AzurePortalColors.background,
  buttonBackgroundPressed: AzurePortalColors.buttonPressed,
  buttonBackgroundDisabled: AzurePortalColors.buttonDisabled,
  buttonBorder: AzurePortalColors.buttonRest,
  buttonBorderFocused: AzurePortalColors.buttonRest,
  buttonOutlineFocused: themePalette.blueLight,
  buttonText: AzurePortalColors.buttonRest,
  buttonTextHovered: AzurePortalColors.background,
  buttonTextChecked: AzurePortalColors.background,
  buttonTextCheckedHovered: AzurePortalColors.background,
  buttonTextPressed: AzurePortalColors.background,
  buttonTextDisabled: AzurePortalColors.background,
  buttonBorderDisabled: 'transparent',

  primaryButtonBackground: AzurePortalColors.buttonRest,
  primaryButtonBackgroundHovered: AzurePortalColors.buttonHovered,
  primaryButtonBackgroundPressed: AzurePortalColors.buttonPressed,
  primaryButtonBackgroundDisabled: AzurePortalColors.buttonDisabled,
  primaryButtonBorder: 'transparent',
  primaryButtonBorderFocused: AzurePortalColors.background,

  primaryButtonText: AzurePortalColors.background,
  primaryButtonTextHovered: AzurePortalColors.background,
  primaryButtonTextPressed: AzurePortalColors.background,
  primaryButtonTextDisabled: AzurePortalColors.background,

  menuBackground: AzurePortalColors.background,
  menuDivider: AzurePortalColors.sectionDividerScrollbar,
  menuIcon: themePalette.themePrimary,
  menuHeader: themePalette.themePrimary,
  menuItemBackgroundHovered: AzurePortalColors.itemBackgroundOnHover,
  menuItemBackgroundPressed: AzurePortalColors.itemBackgroundOnSelect,
  menuItemText: AzurePortalColors.textColor,
  menuItemTextHovered: AzurePortalColors.textColor,

  listBackground: AzurePortalColors.background,
  listText: AzurePortalColors.textColor,
  listItemBackgroundHovered: AzurePortalColors.itemBackgroundOnHover,
  listItemBackgroundChecked: AzurePortalColors.itemBackgroundOnSelect,
  listItemBackgroundCheckedHovered: AzurePortalColors.itemBackgroundOnHover,

  listHeaderBackgroundHovered: AzurePortalColors.itemBackgroundOnHover,
  listHeaderBackgroundPressed: AzurePortalColors.itemBackgroundOnSelect,

  actionLink: AzurePortalColors.hyperlinkText,
  actionLinkHovered: AzurePortalColors.hyperlinkText,
  link: AzurePortalColors.hyperlinkText,
  linkHovered: AzurePortalColors.hyperlinkHoverText,

  // Deprecated slots, second pass by _fixDeprecatedSlots() later for self-referential slots
  listTextColor: '',
  accentButtonBackground: AzurePortalColors.buttonRest,
  disabledBodySubtext: AzurePortalColors.disabledText,
  inputText: AzurePortalColors.textColor,
  inputTextHovered: AzurePortalColors.textControlOutlineHovered,
  accentButtonText: AzurePortalColors.textColor,
  menuItemBackgroundChecked: AzurePortalColors.background,
  ...AzurePortalColors,
};

export const lightTheme: Partial<ThemeExtended> = {
  semanticColors,
  palette: themePalette,
  fonts: {
    tiny: {
      fontFamily:
        "'Segoe UI', 'Segoe UI Web (West European)', 'Segoe UI', -apple-system, BlinkMacSystemFont, 'Roboto', 'Helvetica Neue', sans-serif",
      MozOsxFontSmoothing: 'grayscale',
      WebkitFontSmoothing: 'antialiased',
      fontSize: '10px',
      fontWeight: 600,
    },
    xSmall: {
      fontFamily:
        "'Segoe UI', 'Segoe UI Web (West European)', 'Segoe UI', -apple-system, BlinkMacSystemFont, 'Roboto', 'Helvetica Neue', sans-serif",
      MozOsxFontSmoothing: 'grayscale',
      WebkitFontSmoothing: 'antialiased',
      fontSize: '11px',
      fontWeight: 400,
    },
    small: {
      fontFamily:
        "'Segoe UI', 'Segoe UI Web (West European)', 'Segoe UI', -apple-system, BlinkMacSystemFont, 'Roboto', 'Helvetica Neue', sans-serif",
      MozOsxFontSmoothing: 'grayscale',
      WebkitFontSmoothing: 'antialiased',
      fontSize: '12px',
      fontWeight: 400,
    },
    smallPlus: {
      fontFamily:
        "'Segoe UI', 'Segoe UI Web (West European)', 'Segoe UI', -apple-system, BlinkMacSystemFont, 'Roboto', 'Helvetica Neue', sans-serif",
      MozOsxFontSmoothing: 'grayscale',
      WebkitFontSmoothing: 'antialiased',
      fontSize: '13px',
      fontWeight: 400,
    },
    medium: {
      fontFamily:
        "'Segoe UI', 'Segoe UI Web (West European)', 'Segoe UI', -apple-system, BlinkMacSystemFont, 'Roboto', 'Helvetica Neue', sans-serif",
      MozOsxFontSmoothing: 'grayscale',
      WebkitFontSmoothing: 'antialiased',
      fontSize: '14px',
      fontWeight: 400,
    },
    mediumPlus: {
      fontFamily:
        "'Segoe UI', 'Segoe UI Web (West European)', 'Segoe UI', -apple-system, BlinkMacSystemFont, 'Roboto', 'Helvetica Neue', sans-serif",
      MozOsxFontSmoothing: 'grayscale',
      WebkitFontSmoothing: 'antialiased',
      fontSize: '15px',
      fontWeight: 400,
    },
    large: {
      fontFamily: "'Segoe UI Web (West European)', 'Segoe UI', -apple-system, BlinkMacSystemFont, 'Roboto', 'Helvetica Neue', sans-serif",
      MozOsxFontSmoothing: 'grayscale',
      WebkitFontSmoothing: 'antialiased',
      fontSize: '17px',
      fontWeight: 300,
    },
    xLarge: {
      fontFamily:
        "'Segoe UI', 'Segoe UI Web (West European)', 'Segoe UI', -apple-system, BlinkMacSystemFont, 'Roboto', 'Helvetica Neue', sans-serif",
      MozOsxFontSmoothing: 'grayscale',
      WebkitFontSmoothing: 'antialiased',
      fontSize: '21px',
      fontWeight: 100,
    },
    xLargePlus: {
      fontFamily:
        "'Segoe UI', 'Segoe UI Web (West European)', 'Segoe UI', -apple-system, BlinkMacSystemFont, 'Roboto', 'Helvetica Neue', sans-serif",
      MozOsxFontSmoothing: 'grayscale',
      WebkitFontSmoothing: 'antialiased',
      fontSize: '21px',
      fontWeight: 100,
    },
    xxLarge: {
      fontFamily:
        "'Segoe UI', 'Segoe UI Web (West European)', 'Segoe UI', -apple-system, BlinkMacSystemFont, 'Roboto', 'Helvetica Neue', sans-serif",
      MozOsxFontSmoothing: 'grayscale',
      WebkitFontSmoothing: 'antialiased',
      fontSize: '28px',
      fontWeight: 100,
    },
    xxLargePlus: {
      fontFamily:
        "'Segoe UI', 'Segoe UI Web (West European)', 'Segoe UI', -apple-system, BlinkMacSystemFont, 'Roboto', 'Helvetica Neue', sans-serif",
      MozOsxFontSmoothing: 'grayscale',
      WebkitFontSmoothing: 'antialiased',
      fontSize: '28px',
      fontWeight: 100,
    },
    superLarge: {
      fontFamily:
        "'Segoe UI', 'Segoe UI Web (West European)', 'Segoe UI', -apple-system, BlinkMacSystemFont, 'Roboto', 'Helvetica Neue', sans-serif",
      MozOsxFontSmoothing: 'grayscale',
      WebkitFontSmoothing: 'antialiased',
      fontSize: '42px',
      fontWeight: 100,
    },
    mega: {
      fontFamily:
        "'Segoe UI', 'Segoe UI Web (West European)', 'Segoe UI', -apple-system, BlinkMacSystemFont, 'Roboto', 'Helvetica Neue', sans-serif",
      MozOsxFontSmoothing: 'grayscale',
      WebkitFontSmoothing: 'antialiased',
      fontSize: '72px',
      fontWeight: 100,
    },
  },
  isInverted: false,
  disableGlobalClassNames: false,
};
