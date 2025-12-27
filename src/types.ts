export enum DisplayMode {
  CARD = 'Card',
  TABLE = 'Table',
  CHART = 'Chart',
}

export interface SelectedField {
  path: string;
  label: string;
  type: string;
}

export interface WidgetConfig {
  id: string;
  name: string;
  apiUrl: string;
  refreshInterval: number;
  displayMode: DisplayMode;
  selectedFields: SelectedField[];
}

export interface WidgetData {
  id: string;
  config: WidgetConfig;
  lastData: any;
  lastUpdated: string;
  isLoading: boolean;
}

export interface FlattenedField {
  path: string;
  value: any;
  type: string;
}
