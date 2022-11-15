export interface Launchable {
  launch(): Promise<void>;
  isLaunched(): boolean;
}
