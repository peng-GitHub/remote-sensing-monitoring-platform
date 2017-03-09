$(function () {
    /************* Variables *************/
    var treeID = "tree";



    var jsTreeConfig = {
        core: {
            data: [
                {
                    'id': 'node_2',
                    'text': '地图',
                    'state': { 'opened': true, 'selected': false,"disabled":true },
                    'icon': 'icon-folder-close blue',
                    'children': [{ 'id': '1', 'text': 'BaseMap', 'icon': 'icon-file blue', 'state': {  'selected': true,"disabled":true } }, { 'id': '2', 'text': 'ImageService', 'icon': 'icon-file blue' }, { 'id': '3', 'text': 'CsvLayer', 'icon': 'icon-file blue' }]
                }
            ],
            themes: { responsive: false }
          },
        plugins: [/*'state', 'dnd', 'contextmenu', 'wholerow'*/"checkbox"]
    };

    var isGridInitialised = false;
    
    /******************* Functions *******************/

    function initTree() {
        tree = $("#" + treeID);
        tree.jstree(jsTreeConfig)
                .on('loaded.jstree', function () {
                    var nodes = tree.jstree("get_node", "#");
                    if (nodes && nodes.children.length > 0) {
                        var rootNode = tree.jstree("get_node", nodes.children[0]);
                        tree.jstree("select_node", rootNode);
                    }
                    adjustWidthAndHeight();
                })
                .on('select_node.jstree', function (e, data) {//node选a择事件，data.node是当前选中的node
                //.on('changed.jstree', function (e, data) {//node选a择事件，data.node是当前选中的no
                     //if(data.node.id=="2") {
                         if(data.selected=="1,2") {//data.selected is an array of selected node IDs

                         sou();
                     }else if(data.selected=="1,3"){
                         alert('未找到此图层');
                     }
                else{
                             alert('未找到此图层')
                         }

                }



                //alert('触发一个事件');

            )
              .on('deselect_node.jstree', function (e, data) {
                if (map) {
                    // map.graphics.clear();
                    //var test= map.getLayer(1);
                    //map.removeLayer(test);
                    map.removeLayer(imageServiceLayer);
                    // map.DeleteLayer(imageServiceLayer);

                    //map.removeAllLayers();
                    //map.remove(Layer);


                }


        });

    }

    function refreshTree() {
        var treenode = getSelectedTreeNode();
        if (false != treenode) {
            treenode = treenode[0];
            $("#" + treeID).jstree("load_node", treenode);
        }
    }

    function getSelectedTreeNode() {
        var node = false;
        var treenode = $("#" + treeID).jstree("get_selected", true);
        if (undefined != treenode && null != treenode && treenode.length > 0) {
            node = treenode;
        }
        return node;
    }

    $(".dtpicker").datetimepicker({
        format: 'yyyy-mm-dd',
        weekStart: 1,
        autoclose: true,
        todayBtn: 'linked',
        language: 'zh-CN',
        todayHighlight: true,
        minView: "month",
        pickerPosition: "bottom-left"
    });



    initTree();
    adjustWidthAndHeight();
});

//自适应宽和高
function adjustWidthAndHeight() {
    var windowHeight = $(window).height();



    var treeTop = $("#tree").offset().top;
    $("#tree").height(windowHeight - treeTop - 300);
    $("#map").height(windowHeight - treeTop - 5);
    $("#search").height(windowHeight - treeTop - 5);
}