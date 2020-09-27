import BlockGroup from "./BlockGroup";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MapEditor extends cc.Component {

  private _blockGroup: BlockGroup;

  public init(blockGroup: BlockGroup) {
    this._blockGroup = blockGroup;
  }

  // touch start
  public touchStartandle(event: cc.Touch): void {
    let touchPos: cc.Vec2 = this.node.convertToNodeSpaceAR(event.getLocation());
    let spriteFrame = this._blockGroup.getCurSelectSprite(touchPos);
    if (spriteFrame != null) {
      this._blockGroup.MoveSprite.active = true;
      this._blockGroup.MoveSprite.getComponent(cc.Sprite).spriteFrame = spriteFrame;
      this._blockGroup.MoveSprite.setPosition(touchPos);
    }
  }

  // touch move
  public touchMoveHandle(event: cc.Touch): void {
    let movePos: cc.Vec2 = this.node.convertToNodeSpaceAR(event.getLocation());
    this._blockGroup.MoveSprite.setPosition(movePos);
  }

  // touch end || cancel
  public touchEndHandle(event: cc.Touch): void {
    let endPos: cc.Vec2 = event.getLocation();
    let mapSprite: cc.Sprite = this._blockGroup.getEndSelectSprite(endPos);
    if (mapSprite != null && this._blockGroup.MoveSprite.active) {
      mapSprite.spriteFrame = this._blockGroup.MoveSprite.getComponent(cc.Sprite).spriteFrame;
    }
    this._blockGroup.MoveSprite.active = false;
  }
}