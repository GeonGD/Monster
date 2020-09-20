const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    // onLoad () {}

    @property(cc.SpriteAtlas)
    ImageAtlas: cc.SpriteAtlas;

    MapBlockData: number[][] = [];

    start() {

        for (let i = 0; i < 6; i++) {
            this.MapBlockData[i] = []
        }
        console.log(this.MapBlockData);
        for (let j = 0; j < 6; j++) {
            let y = j * 106;
            for (let i = 0; i < 6; i++) {
                let x = i * 106;
                this.createSpriteNode(x, y);
            }
        }
    }

    private createSpriteNode(x: number, y: number) {
        let blockNode: cc.Node = new cc.Node();
        this.node.addChild(blockNode);
        let spriteCom = blockNode.addComponent(cc.Sprite);
        spriteCom.spriteFrame = this.ImageAtlas.getSpriteFrame("11");
        blockNode.x = x + 106 / 2;
        blockNode.y = -y - 106 / 2;
    }

    // update (dt) {}
}
