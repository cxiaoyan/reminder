var app=angular.module("test",[]);

//$watch  $diget
//angular 内部的每一条数据都被$watch监测或者复制操作会隐式调用$scope.$digest();
//$watch一直监测数据的变化
//$diget 将$watch监测到的数据都遍历一遍，如果有值发生变化，重新渲染一遍
//如果angular内部有值发生变化，外部必须调用$apply来隐式调用$diget，内部不用管，内部已经隐式调用了$diget。
//controller内部的函数操作


//directive定义一个自定义属性的关键字，自定义属性是在app上定义的，不是angular内部定义的

//directive的关键属性：
//restrict:"A",A表示attribute，是属性的意思
//replace:true,这个表示有自定义属性的那个元素是否被替换，true表示要替换
//transclude:true,这个属性表示是否要保留并且包含有自定义属性的那个元素里边的元素，true表示包含，要配合<div ng-transclude></div>一起使用
//link:function($scope,el){}这个link函数体是自定义属性完了之后要走一遍link函数体，在这个函数体里边可以操作dom元素，可以使用jQuery和JavaScript。
//$scope是必须写的，el代表后边那个要取代之前有自定义属性的那个元素 
//el是dom元素


//添加了一个自定义属性my-u(左侧的列表项)
app.directive("myU",[function(){
	return{
		restrict:"A",
		replace:true,
		transclude:true,
		template:'<div class="lis"><div ng-transclude></div></div>',
		link:function($scope,el){			
			$(el).on("click",".link",function(){
				var lis=$(el).find(".option");
				lis.removeClass("active");
				$(this).addClass("active");
				console.log($(".active").index())
				var self=this;
				$scope.$apply(function(){
					$scope.cu=$(self).index();
				})
				return false;
			});
			$(el).on("keyup",false);
			$(el).find("input").on("keyup",false);
			
//			选中某个列表，按下删除键时，删掉这条数据
			$(document).on("keyup",function(e){
				if(e.keyCode===8){
					var index=$(".active").index();
					if(index!==-1){
//						angular内部已经删掉了，但是外部需要通过$apply来调用$diget来重新渲染一遍
						$scope.$apply(function(){
							$scope.lists.splice(index,1);
//							调用一下本地存储来同步数据
							$scope.save2local();
						})
					}
					
					
				}
			});
		}
	}
}])


//添加了一个自定义属性button(选项)
app.directive("button",[function(){
	return{
		restrict:"A",
		replace:true,
		transclude:true,
		template:"<div class='choice'><div ng-transclude></div></div>",
		link:function($scope,el){
//			阻止冒泡
			$(document).on("keyup",":input",false)
			$(el).on("click",function(){
				$(this).css("cursor","pointer")
				$(this).find(".hidden").toggle();
				return false;
			});
			$(el).find(".hidden").on("click",false);
			$(document).on("click",function(){
				$(el).find(".hidden").hide();
			})
		}
	}
}])



app.controller("mainCtrl",["$scope",function($scope){
	$scope.lists=[];
	$scope.colors=['col1','col2','col3','col4','col5','col6','col7','col8'];
	$scope.cu=0;
	
	
//	检查本地存储中是否有reminder，如果有就将数据转换为我们认识的数组并放在$scope.lists数组当中
	if(localStorage.reminder){
		$scope.lists=JSON.parse(localStorage.reminder);
	}else{
		$scope.lists=[
//			{
//				id:1003,
//				name:'买书列表',
//				theme:'blue',
//				todos:[
//					{name:'买书你本',state:1},
//					{name:'没写呢你',state:1},
//					{name:'的卡夫卡',state:0},
//				]
//			}
		];
	}
	
	
//	将lists数据当中的数据存转换为localStorage认识的字符串格式并存储到localStorage当中
	$scope.save2local=function(){
		localStorage.reminder=JSON.stringify($scope.lists);
	}
	

//  获取lists数组当中的最大的那个id，并将max返回
	function maxId(){
		var max=-Infinity;
		for(var i=0;i<$scope.lists.length;i++){
			var v=$scope.lists[i];
			if(v.id>max){
				max=v.id;
			}
		}
		return (max===-Infinity) ? 1000 : max;
	}
	
	
//	添加列表，向数组中push一条数据
	$scope.addlist=function(){
		var len=$scope.lists.length;
		console.log(len)
		var index=len%7;
		var v={
			id:maxId()+1,
			name:'新列表'+(len+1),
			theme:$scope.colors[index],
			todos:[]
		};
		$scope.lists.push(v);
	}
	
//	计算已完成的数量
	
	$scope.count=function(){
		var r=0;
		$scope.lists[$scope.cu].todos.forEach(function(v,i){
			if(v.state===1){
				r++
			}
		});
		return r;
	}
	
	
	$scope.count2=function(){
		var r=0;
		$scope.lists[$scope.cu].todos.forEach(function(v,i){
			if(v.state===0){
				r++
			}
		});
		return r;
	}
	
//	清除已完成
	
	$scope.clear=function(){
		var newarr = [];
		$scope.lists[$scope.cu].todos.forEach(function(v,i){
			if(v.state===0){
				newarr.push(v);
			}
		});
		$scope.lists[$scope.cu].todos=newarr;
	}
	
	
//	选项里边的取消与完成函数
	$scope.cancel=function(){
		var hidden=$(".hidden");
		hidden.hide();
	}
	
//	选项里边的删除函数
	$scope.del=function(){
		$scope.lists.splice($scope.cu,1)
	}
	
	
//	$(".com-lis").on("click",false)
	$scope.addclass=function(){
		$(".wei").on("mouseover",".com-lis",function(){
			$(".com-lis").removeClass($scope.lists[$scope.cu].theme);
			$(this).addClass($scope.lists[$scope.cu].theme);
			$(".zhegai").removeClass($scope.lists[$scope.cu].theme);
			$(this).find(".zhegai").addClass($scope.lists[$scope.cu].theme);
			return false;
		})
		
		$(".comed").on("mouseover",".com-lis",function(){
			$(".com-lis").removeClass($scope.lists[$scope.cu].theme);
			$(this).addClass($scope.lists[$scope.cu].theme);
			$(".zhegai").removeClass($scope.lists[$scope.cu].theme);
			$(this).find(".zhegai").addClass($scope.lists[$scope.cu].theme);
			return false;
		})
		
		$(document).on("mouseover",function(){
			$(".zhegai").removeClass($scope.lists[$scope.cu].theme);
			$(".com-lis").removeClass($scope.lists[$scope.cu].theme);
		})
			
	}
	
	$scope.xiala=function(){
		$(".wei").on("click",".com-tit",function(){
			$(this).closest(".wei").find(".com-lis").toggleClass("shows");
			$(this).find(".spans").toggleClass("changeImg");
		})	
	}
	
	$scope.xiala2=function(){
		$(".comed").on("click",".com-tit",function(){
			$(this).closest(".comed").find(".com-lis").toggleClass("shows");
			$(this).find(".spans").toggleClass("changeImg");
		})
	
	}	
	
//	$scope.blur=function(){
//		$("#bianji").on("focus",function(){
//			$(".pro-ct").html('');
//		})
//	}
	
	
	
}])
