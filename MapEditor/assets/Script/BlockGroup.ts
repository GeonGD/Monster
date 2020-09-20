import LevelView from "./LevelView";

declare let require;
const { ccclass, property } = cc._decorator;

@ccclass
export default class BlockGroup extends cc.Component {

    @property(cc.SpriteAtlas)
    MapSpriteAtlas: cc.SpriteAtlas[] = [];

    @property(cc.Node)
    MoveSprite: cc.Node;

    @property(cc.Node)
    BlockMap: cc.Node;

    @property(LevelView)
    LevelViewController: LevelView;

    /** 选择素材相关 */
    private _modelItem: cc.Node[] = [];     // 当前可用关卡元素
    private _selectSpriteAtlas: number = 0; // 默认选择关卡图集 
    private _spriteAtlasCount: number = 0;  // 当前选择图集长度
    private _columnCount: number = 4;   // 每列有几个元素
    private _spriteWidth: number = 106;  // 图片宽度

    /** 地图相关 */
    private _defaultMapData: number[][] = [
        [14, 14, 14, 14, 14, 14],
        [14, 14, 14, 14, 14, 14],
        [14, 14, 14, 14, 14, 14],
        [14, 14, 14, 14, 14, 14],
        [14, 14, 14, 14, 14, 14],
        [14, 14, 14, 14, 14, 14]
    ]
    private _mapBlockSprite: cc.Node[][] = [];  // 地图快对象数组

    start() {
        cc.macro.ENABLE_MULTI_TOUCH = false;
        this.LevelViewController.init(this);

        this.MoveSprite.zIndex = 100;
        this._eachSpriteAtlas();
        this._createBlockMap(this._defaultMapData);
    }

    onLoad() {
        this.node.on(cc.Node.EventType.TOUCH_START, this._touchStartandle, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this._touchMoveHandle, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this._touchEndHandle, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this._touchEndHandle, this);
    }

    // 绘制素材图
    private _eachSpriteAtlas(): void {
        // 处理数组越界
        if (this._selectSpriteAtlas >= this.MapSpriteAtlas.length) return;
        // 获取当前选择图集
        let frames: cc.SpriteFrame[] = this.MapSpriteAtlas[this._selectSpriteAtlas].getSpriteFrames();
        // 当前图集拥有精灵数量
        this._spriteAtlasCount = frames.length;
        // 清理已存在精灵
        this._clearModelSprite();
        // 生成新的精灵
        for (let i = 0; i < frames.length; i++) {
            // 创建节点
            let node: cc.Node = new cc.Node();
            this.node.addChild(node);
            // 添加sprite脚本
            let spriteCom: cc.Sprite = node.addComponent(cc.Sprite);
            spriteCom.spriteFrame = frames[i];
            // 计算每个精灵位置
            node.x = i % this._columnCount * this._spriteWidth + i % this._columnCount + this._spriteWidth / 2;
            node.y = -Math.floor(i / this._columnCount) * this._spriteWidth - Math.floor(i / this._columnCount) - this._spriteWidth / 2;
            // 持有精灵对象
            this._modelItem.push(node);
        }
    }

    // 切换背景，清理旧精灵
    private _clearModelSprite(): void {
        this._modelItem.forEach((item: cc.Node, index: number) => {
            this.node.removeChild(item, true);
        })
    }

    // 创建地图
    private _createBlockMap(mapData: number[][]): void {
        if (this._selectSpriteAtlas >= this.MapSpriteAtlas.length) return;
        this._clearBlockMap();
        mapData.forEach((columnMap: number[], index: number) => {
            this._mapBlockSprite[index] = []
            for (let i = 0; i < columnMap.length; i++) {
                let node: cc.Node = new cc.Node();
                this.BlockMap.addChild(node);
                // 添加sprite脚本
                let spriteCom: cc.Sprite = node.addComponent(cc.Sprite);
                spriteCom.spriteFrame = this.MapSpriteAtlas[this._selectSpriteAtlas].getSpriteFrame(columnMap[i].toString());
                // 计算节点坐标
                node.x = i * this._spriteWidth + this._spriteWidth / 2;
                node.y = -index * this._spriteWidth - this._spriteWidth / 2;
                // 持有节点
                this._mapBlockSprite[index][i] = node;
            }
        })
    }

    // 清理地图
    private _clearBlockMap(): void {
        this.BlockMap.removeAllChildren(true);
    }

    // 获取当前点击图片精灵
    private _getCurSelectSprite(touchPos: cc.Vec2): cc.SpriteFrame {
        let x: number = Math.floor(touchPos.x / this._spriteWidth);
        let y: number = Math.floor(Math.abs(touchPos.y) / this._spriteWidth);
        let itemIndex: number = y * this._columnCount + x;
        // cc.log(x, y, itemIndex);
        // 点击元素下标 利用图集数量和每列最大数量控制边界
        if (itemIndex >= this._spriteAtlasCount || x >= this._columnCount) {
            return null;
        } else {
            return this._modelItem[itemIndex].getComponent(cc.Sprite).spriteFrame;
        }
    }

    // 移动结束放置元素
    private _getEndSelectSprite(endPos: cc.Vec2): cc.Sprite {
        let radius: number = this._spriteWidth / 2;
        let result: cc.Sprite = null;
        this._mapBlockSprite.forEach((columnMap: cc.Node[], index: number) => {
            for (let i = 0; i < columnMap.length; i++) {
                let pos = this._mapBlockSprite[index][i].convertToNodeSpaceAR(endPos);
                if (pos.x < radius && pos.x > -radius && pos.y < radius && pos.y > -radius) {
                    result = this._mapBlockSprite[index][i].getComponent(cc.Sprite);
                    break;
                }
            }
        })
        return result;

    }

    // touch start
    private _touchStartandle(event: cc.Touch): void {
        let touchPos: cc.Vec2 = this.node.convertToNodeSpaceAR(event.getLocation());
        let spriteFrame = this._getCurSelectSprite(touchPos);
        if (spriteFrame != null) {
            this.MoveSprite.active = true;
            this.MoveSprite.getComponent(cc.Sprite).spriteFrame = spriteFrame;
            this.MoveSprite.setPosition(touchPos);
        }
    }

    // touch move
    private _touchMoveHandle(event: cc.Touch): void {
        let movePos: cc.Vec2 = this.node.convertToNodeSpaceAR(event.getLocation());
        this.MoveSprite.setPosition(movePos);
    }

    // touch end || cancel
    private _touchEndHandle(event: cc.Touch): void {
        let endPos: cc.Vec2 = event.getLocation();
        let mapSprite: cc.Sprite = this._getEndSelectSprite(endPos);
        if (mapSprite != null && this.MoveSprite.active) {
            mapSprite.spriteFrame = this.MoveSprite.getComponent(cc.Sprite).spriteFrame;
        }
        this.MoveSprite.active = false;
    }

    // 导出地图
    public OutputMapData() {
        let outputData: number[][] = [];
        this._mapBlockSprite.forEach((columnMap: cc.Node[], index: number) => {
            outputData[index] = []
            for (let i = 0; i < columnMap.length; i++) {
                outputData[index][i] = Number(columnMap[i].getComponent(cc.Sprite).spriteFrame.name);
            }
        })
        let blob = new Blob([JSON.stringify(outputData)]);
        const saveAs = require("./Libs/FileSave.js");
        saveAs(blob, "map.bin");
    }

    // 导入地图
    public InputMapData() {
        this.LevelViewController.node.active = true;
    }

    // 更新地图
    public UpdateMapData(data: number[][] | cc.Event = null) {
        if (data == null || data instanceof cc.Event) {
            this._createBlockMap(this._defaultMapData);
        } else {
            this._createBlockMap(data);
        }
    }
}
