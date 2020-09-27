export default class DataManager {

  private static _instance: DataManager;
  public static get Instance(): DataManager {

    if (DataManager._instance == null) {
      DataManager._instance = new DataManager();
    }
    return DataManager._instance;
  }

  private _currentLevel: number = 0;
  private _mapData: number[][] = [];
  private _routeData: cc.Vec2[] = [];

  public get currentLevel(): number {
    return this._currentLevel;
  }

  public set currentLevel(value: number) {
    this._currentLevel = value;
  }

  public get mapData() {
    return this._mapData;
  }

  public get routeData() {
    return this._routeData;
  }

  public setRouteData(path: cc.Vec2) {
    if (this._checkRouteData(path)) return;
    this._routeData.push(path);
    console.log(this._routeData);
  }

  private _checkRouteData(path: cc.Vec2): boolean {
    return this._routeData.includes(path);
  }
}