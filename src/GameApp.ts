/**
 * Copyright (c) 2014,Egret-Labs.org
 * All rights reserved.
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of the Egret-Labs.org nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY EGRET-LABS.ORG AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL EGRET-LABS.ORG AND CONTRIBUTORS BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

class GameApp extends egret.DisplayObjectContainer{

    /**
     * 加载进度界面
     */
	private map:com.wwyx.Map;
    //private uiStage:egret.UIStage;
    public constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE,this.onAddToStage,this);
    }

    private onAddToStage(event:egret.Event){
        this.createGameScene();
    }
   
    
    private createGameScene():void{

        var stageW:number = this.stage.stageWidth;
        var stageH:number = this.stage.stageHeight;
		
        this.map=new com.wwyx.Map();
        this.addChild(this.map);


       
       
        /*
        this.mainContainer = new egret.gui.Group();
        this.mainContainer.percentWidth = 100;
        this.mainContainer.percentHeight = 100;
        uiStage.addElement(this.mainContainer);
        */
        var zoomIn:ZoomButton=new ZoomButton();
        zoomIn.setLabel("放大");
        this.addChild(zoomIn);

        var zoomOut:ZoomButton=new ZoomButton();
        zoomOut.setLabel("缩小");
        this.addChild(zoomOut);


        var openMap:ZoomButton=new ZoomButton();
        openMap.setLabel("开源地图");
        this.addChild(openMap);

        var googleMap:ZoomButton=new ZoomButton();
        googleMap.setLabel("google地图");
        this.addChild(googleMap);


        zoomIn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.dozoomIn,this);
        zoomOut.addEventListener(egret.TouchEvent.TOUCH_TAP,this.dozoomOut,this);

        openMap.addEventListener(egret.TouchEvent.TOUCH_TAP,this.openMap,this);
        googleMap.addEventListener(egret.TouchEvent.TOUCH_TAP,this.googleMap,this);

        zoomIn.y=zoomOut.y=stageH-50;
        zoomIn.x=(stageW/2)-300;
        zoomOut.x=zoomIn.x+150;
        openMap.x=zoomOut.x+150;
        googleMap.x=zoomOut.x+300;
        openMap.y=googleMap.y=zoomIn.y;

    }

     private dozoomIn(event:egret.Event){
        this.map.zoomIn();
     }
     private dozoomOut(event:egret.Event){
        this.map.zoomOut();
     }
     private openMap(event:egret.Event){
        this.map.mapProvider=new com.wwyx.OpenStreetMapProvider();
     }
     private googleMap(event:egret.Event){
        this.map.mapProvider=new GoogleMapProvider();
     }
    
    
}

class ZoomButton extends egret.Sprite
{
    public constructor(){
        super();
        this.touchEnabled=true;
        this.createView();
    }
    private textField:egret.TextField;

    private createView():void {
        this.textField = new egret.TextField();
        this.addChild(this.textField);
        this.touchChildren=false;
        this.textField.width = 150;
        this.textField.height = 50;
        this.textField.textAlign = "center";
        var g:egret.Graphics=this.graphics;
        g.clear();
        g.beginFill(0x000000,.5);
        g.drawRect(0,0,150,50);
        g.endFill();

    }

    public setLabel(value:string):void {
        this.textField.text = value;
    }
}


