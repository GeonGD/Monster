import BlockGroup from "./BlockGroup";
import DataManager from "./DataManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class LevelView extends cc.Component {

  @property(cc.Node)
  LevelItem: cc.Node;

  @property(cc.Node)
  LevelScrollView: cc.Node;

  @property(cc.Node)
  CloseBtn: cc.Node;


  private _maxLevel: number = 20;
  private _blocGroup: BlockGroup;

  onLoad() {
    this.CloseBtn.on(cc.Node.EventType.TOUCH_END, this._closeView, this);
    this._initScrollView();
  }

  public init(blocGroup: BlockGroup) {
    this._blocGroup = blocGroup;
  }

  private _initScrollView() {
    this.LevelScrollView.removeAllChildren();
    for (let i = 0; i < this._maxLevel; i++) {
      let child: cc.Node = cc.instantiate(this.LevelItem);
      this.LevelScrollView.addChild(child);

      let levelLabel: cc.Label = child.getComponentInChildren(cc.Label);
      levelLabel.string = (i + 1).toString();

      child.on(cc.Node.EventType.TOUCH_END, () => { this._inputMapData(i + 1) }, this);

      child.active = true;
    }
  }

  // 读取关卡二进制文件
  private _inputMapData(level: number) {
    cc.resources.load(`MapData/level${level}`, (err, data: any) => {
      if (err) {
        cc.error(err.message || err);
        return;
      }
      let mapData = null;
      if (data._buffer instanceof ArrayBuffer) {
        mapData = new Uint8Array(data._buffer)
      } else {
        mapData = mapData._buffer
      }

      let str = String.fromCharCode.apply(null, mapData);
      let res = JSON.parse(str);
      DataManager.Instance.currentLevel = level;
      this._blocGroup.UpdateMapData(res)
    });
    
  }

  private _closeView() {
    this.node.active = false;
  }


}