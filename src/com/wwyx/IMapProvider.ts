module com.wwyx
{
	export interface IMapProvider
	{
		getTileUrl(row:number,col:number,zoom:number):string;
	}
}