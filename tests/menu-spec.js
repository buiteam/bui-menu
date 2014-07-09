var $ = require('jquery'),
  expect = require('expect.js'),
  sinon = require('sinon'),
  Menu = require('../index');

describe('测试菜单生成', function(){
	
	var menu = new Menu.Menu({
		render : '#m1',
		children : [
			{
				xclass : 'menu-item',
				content : '菜单一'

			},
			{
				id : 'm12',
				xclass : 'menu-item',
				content: '菜单二'
			},
			{
				xclass : 'menu-item',
				tpl : '<span><a href="{href}">{text}</a></span>',
				href :'http://www.taobao.com',
				text : '链接'
			}
		]
	});

	menu.render();
	el = menu.get('el');
	var children = menu.get('children');
	describe("测试菜单生成",function(){
		it('生成菜单',function(){
			expect(el).not.to.be(undefined);
			expect(el[0].nodeName).to.be('UL');
			expect(el.hasClass('bui-menu')).to.be.ok();
		});

		it('生成子菜单',function(){
			
			expect(el.children().length).to.be(children.length);
			$.each(children,function(i,item){
				expect(item.get('el').hasClass('bui-menu-item')).to.be.ok();
			})
		});
		
		it('测试点击事件',function(){
			var item = children[0],
				callback = sinon.spy();
			menu.on('itemclick',callback);

			item.fire('click');
			expect(callback.called).to.be(true);
			item.off('click');
		});

		it('测试点击事件Target',function () {
			var item = children[0],
				target = null;

			menu.on('itemclick',function(ev){
				target = ev.item;
			});

			item.fire('click');
			expect(target).to.be(item);
			item.off('click');
		});

		it('测试模版',function(){
			var item = children[2];
			var text = item.get('el').text();
			expect(text).to.be('链接');
		});
		it('查找菜单项',function(){
			var id = "m12",
				item = menu.findItemById(id);
			expect(item).not.to.be(null);
			expect(item.get('id')).to.be(id);
		});
	});

	
});

describe('测试侧边栏菜单', function(){
	var sideMenu = new Menu.SideMenu({
				width:200,
				render:'#m2',
				items : [
					{text:'基本结构',items:[
						{text : '上部导航',href:'1.php'},{id:'ss1',text:'左边导航',href:'2.php'}
					]},
					{text:'常用页面',collapsed:true,items:[
						{text : '上部导航',href:'1.php'},{text:'左边导航',href:'2.php'}
					]}
				]
			});

			sideMenu.render();
	describe("测试侧边栏菜单",function(){
			
			var el = sideMenu.get('el');
			it("测试菜单生成",function(){
				expect(el).not.to.be(undefined);
				var children = el.children();
				expect(children.length).to.be(2);
			});
			it('设置选中的菜单',function(){
				var id = 'ss1',
					item = null;
				sideMenu.setSelectedByField(id);
				item = sideMenu.getSelected();
				expect(item).not.to.be(null);
				expect(item.get('id')).to.be(id);
			});

		});

	});

describe('测试菜单动作', function(){
	var subMenu = new Menu.ContextMenu({

			children : [
				{
					xclass : 'context-menu-item',
					iconCls:'icon-refresh',
					text : '刷新'

				},
				{xclass:'menu-item-sparator'},
				{
					id : 'm13',
					xclass : 'context-menu-item',
					iconCls:'icon-remove',
					text: '关闭'
				},
				{
					xclass : 'context-menu-item',
					iconCls:'icon-remove-sign',
					text : '关闭所有'
				}
			]
		}),
		menu = new Menu.ContextMenu({
		children : [
			{
				iconCls:'icon-refresh',
				text : '刷新'

			},
			{xclass:'menu-item-sparator'},
			{
				id : 'm12',
				iconCls:'icon-remove',
				text: '关闭',
				subMenu : subMenu
			},
			{
				iconCls:'icon-remove-sign',
				text : '关闭所有'
			}
		]
	});

	var contentEl = $('<div></div>');
	contentEl.on('click',function(e){
		menu.set('xy',[e.pageX,e.pageY]);
		menu.show();
	});
	
	describe('测试菜单生成',function () {

		it('测试菜单项生成',function () {
			menu.render();
			var item = menu.findItemById('m12');
			expect(item).not.to.be(null);
			expect(item.get('subMenu')).not.to.be(undefined);
		});

	});

	describe('显示菜单后',function () {

		it('测试菜单项生成',function () {
			//expect(menu.get('visible')).to.be(false);
			contentEl.trigger('click',{pageX:100,pageY:100});
			expect(menu.get('visible')).to.be(true);
		});

		it('测试更改菜单项图标',function () {
			var item = menu.findItemById('m12'),
				itemEl = item.get('el');
			expect(itemEl.find('.icon-remove').length).not.to.be(0);
			item.set('iconCls','icon-ok');
			expect(itemEl.find('.icon-ok').length).not.to.be(0);
			expect(itemEl.find('.icon-remove').length).to.be(0);
		});
		it('测试子菜单显示',function () {
			var item = menu.findItemById('m12');
			item.set('open',true);
			expect(subMenu.get('visible')).to.be(true);

			item.set('open',false);
			expect(subMenu.get('visible')).to.be(false);
		});

		it('测试菜单隐藏',function () {
			var item = menu.findItemById('m12');
			item.set('open',true);
			expect(subMenu.get('visible')).to.be(true);

			menu.hide();
			expect(menu.get('visible')).to.be(false);
			expect(subMenu.get('visible')).to.be(false);
		});
	});
});

describe('测试菜单显示，隐藏', function(){
	$('<button id="btn" class="ks-button">下拉菜单</button><button id="btn1" class="ks-button">外部按钮</button>').appendTo('body');
	var dropMenu = new Menu.PopMenu({
		trigger : '#btn',
		autoRender : true,
		width : 140,
		children : [{
			id:'m1',
			content : "选项1"
		},{
			content : "选项2"
		},{
			content : "选项3"
		}]
	});
	var btn = $('#btn');
	describe('显示,隐藏菜单',function () {
		it('点击显示菜单',function () {
			btn.trigger('click');
			expect(dropMenu.get('visible')).to.be(true);
		});
		it('点击菜单项，隐藏菜单',function() {
			var item = dropMenu.findItemById('m1');
			expect(item).not.to.be(null);

			item.fire('click');
			expect(dropMenu.get('visible')).to.be(false);
		});

		it('显示菜单项后，点击外部隐藏',function () {
			btn.trigger('click');
			expect(dropMenu.get('visible')).to.be(true);
			$('#btn1').trigger('mousedown');
			expect(dropMenu.get('visible')).to.be(false);
		})
	});
});

describe('测试菜单DOM', function(){
	var dropMenu = new Menu.PopMenu({
		trigger : '#link',
		autoRender : true,
		triggerEvent : 'mouseenter',
		triggerHideEvent : 'mouseleave',
		autoHideType:'leave',
		width : 140,
		children : [{
			id:'m5',
			content : "选项1"
		},{
			content : "选项2"
		},{
			content : "选项3"
		}]
	});
	var link = $('#link');
	
});
/*

BUI.use('bui/menu',function(Menu) {

	var menu = new Menu.Menu({
		srcNode : '#m20'
	});

	menu.render();

	describe('测试根据DOM生成菜单',function(){
		it('测试菜单生成',function(){
			expect(menu.get('el').attr('id')).to.be('m20');
			expect(menu.get('children').length).to.be(4);
		});

		it('测试子菜单完成',function(){
			var item = menu.getItemAt(0);
			expect(item.get('subMenu')).not.to.be(null);
		})
	});
});


BUI.use('bui/menu',function(Menu){
	var sideMenu = new Menu.SideMenu({
			width:200,
			srcNode:'#m15',
			collapsedCls : 'title'
		});

	sideMenu.render();
});
*/
