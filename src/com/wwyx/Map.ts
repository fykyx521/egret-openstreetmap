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
module com.wwyx
{
    export class Map extends BaseUI{
    
    private tileGrid:TileGrid;
    public constructor(){
        super();
        this.touchEnabled=true;
        this.addEventListener(egret.Event.ADDED_TO_STAGE,this.onAddToStage,this);
    }
    private onAddToStage(event:egret.Event){
        this.removeEventListener(egret.Event.ADDED_TO_STAGE,this.onAddToStage,this);
        this.addEventListener(egret.TouchEvent.TOUCH_BEGIN,this.touchBegin,this);
    }

    public addChildren():void
    {
        super.addChildren();
        this.tileGrid=new TileGrid();
        this.addChild(this.tileGrid);

    }
    private prePoint:egret.Point;
    private firstPoint:egret.Point;
    private touchBegin(e:egret.TouchEvent):void
    {
         this.prePoint=new egret.Point(e.stageX,e.stageY);
         this.firstPoint=new egret.Point(e.stageX,e.stageY);
         this.addEventListener(egret.TouchEvent.TOUCH_MOVE,this.movegrid,this);
         this.addEventListener(egret.TouchEvent.TOUCH_END,this.touchEnd,this);
         
    }
    private movegrid(e:egret.TouchEvent):void
    {
        var newPoint:egret.Point=new egret.Point(e.stageX,e.stageY);
        var disX:number=newPoint.x-this.prePoint.x;
        var disY:number=newPoint.y-this.prePoint.y;
        
        if(Math.abs(egret.Point.distance(newPoint,this.firstPoint))>=Util.tile_size)
        {
             var disX:number=newPoint.x-this.firstPoint.x;
             var disY:number=newPoint.y-this.firstPoint.y;
             this.tileGrid.panTo(new egret.Point(disX,disY));
             this.firstPoint=newPoint;
        }else
        {
           this.tileGrid.updateTilesByDis(disX,disY);
        
        }
        this.prePoint=newPoint;
       
    }
    private touchEnd(e:egret.TouchEvent):void
    {
          this.prePoint=new egret.Point(e.stageX,e.stageY);
          this.removeEventListener(egret.TouchEvent.TOUCH_MOVE,this.movegrid,this);
          this.removeEventListener(egret.TouchEvent.TOUCH_END,this.touchEnd,this);
          
          var newPoint:egret.Point=new egret.Point(e.stageX,e.stageY);
          var disX:number=newPoint.x-this.firstPoint.x;
          var disY:number=newPoint.y-this.firstPoint.y;
          this.tileGrid.panTo(new egret.Point(disX,disY));//重新计算center
    }

    public set zoom(value:number)
    {
        this.tileGrid.zoom=value;
    }

    public set center(value:Location)
    {
         this.tileGrid.center=value;
    }

    public get zoom():number
    {
         return this.tileGrid.zoom;
    }
    public get center():Location
    {
         return this.tileGrid.center;
    }

    public zoomIn():void
    {
        this.zoom=this.zoom+1;
    }

    public zoomOut():void
    {
        this.zoom=this.zoom-1;
    }

    public set mapProvider(provider:IMapProvider)
    {
       this.tileGrid.mapProvider=provider;
    }


    
   

    
    
}

}
