//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
declare namespace egret {
    export function registerFontMapping(name: string, path: string): void;
}
class Main extends eui.UILayer {


    protected async createChildren() {
        super.createChildren();

        egret.lifecycle.addLifecycleListener((context) => {
            // custom lifecycle plugin
        })

        egret.lifecycle.onPause = () => {
            // egret.ticker.pause();
        }

        egret.lifecycle.onResume = () => {
            // egret.ticker.resume();
        }

        //inject the custom material parser
        //注入自定义的素材解析器
        let assetAdapter = new AssetAdapter();
        egret.registerImplementation("eui.IAssetAdapter", assetAdapter);
        egret.registerImplementation("eui.IThemeAdapter", new ThemeAdapter());

        egret.ExternalInterface.call("sendToNative", "init$0");
        egret.ExternalInterface.addCallback("sendToJS", (message: string) => {
            // alert("message from Native is = " + message);
            let action = message.split('$')[0];
            let parmar = message.split('$')[1];
            switch (action) {
                case "init":
                    platform['name'] = parmar;
                    break;
            }

        });

        egret.ImageLoader.crossOrigin = "anonymous";
        // await wait(500);

        this.runGame().catch(e => {
            console.log(e);
        })
    }

    private setAddapter() {

        new Promise((resolve, reject) => {
            egret.MainContext.instance.stage.orientation = egret.OrientationMode.PORTRAIT;
            egret.MainContext.instance.stage.scaleMode = egret.StageScaleMode.FIXED_WIDTH;
            
            GameData.GameWidth = egret.MainContext.instance.stage.stageWidth;
            GameData.GameHeigth = egret.MainContext.instance.stage.stageHeight;

            return resolve();
        })


    }

    private async onStageResize(evt: egret.Event) {
        await this.setAddapter();
    }

    private async runGame() {
        // 
        await this.setAddapter();
        await this.loadResource();
        this.showLogo();
        await RES.loadGroup("preload", 0);
        this.loadinglogo.hideAndShow(this.createGameScene,this);
        // this.createGameScene();
    }

    private async loadResource() {
        try {
            // const loadingView = new LoadingUI();
            // this.stage.addChild(loadingView);
            await RES.loadConfig("resource/default.res.json", "resource/");
            await this.loadTheme();
            await RES.loadGroup("loadlogo", 0);
            // this.stage.removeChild(loadingView);
            // alert(platform.name);
            if (platform.name != 'web')
                egret.registerFontMapping("myFont", "resource/font/fanti.ttf");
        }
        catch (e) {
            console.error(e);
        }
    }

    private loadTheme() {
        return new Promise((resolve, reject) => {
            // load skin theme configuration file, you can manually modify the file. And replace the default skin.
            //加载皮肤主题配置文件,可以手动修改这个文件。替换默认皮肤。
            let theme = new eui.Theme("resource/default.thm.json", this.stage);
            theme.addEventListener(eui.UIEvent.COMPLETE, () => {
                resolve();
            }, this);

        })
    }

    private loadinglogo: Game.LoadingLogo;    
    private showLogo() {
        this.loadinglogo = new Game.LoadingLogo();
        this.addChild(this.loadinglogo);
    }    

    /**
     * 创建场景界面
     * Create scene interface
     */
    protected createGameScene(): void {
        this.addChild(cor.MainScene.instance());
        this.addChild(Game.TipsSkin.instance());

        let cs = new Game.LoginSkin();
        cor.MainScene.instance().addChild(cs);

        cor.Socket.getIntance().ProConnet();
    }
    /**
     * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
     * Create a Bitmap object according to name keyword.As for the property of name please refer to the configuration file of resources/resource.json.
     */
    private createBitmapByName(name: string): egret.Bitmap {
        let result = new egret.Bitmap();
        let texture: egret.Texture = RES.getRes(name);
        result.texture = texture;
        return result;
    }
}
