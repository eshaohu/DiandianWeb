$(function () {
  'use strict';

  var itemId = $("#itemId").val();
  render(itemId);
  events();

});

function events() {
  $("#uploud_b").bind("click", function(){
    $("#uploadfile_b").trigger('click');
  });
  $("#uploadfile_b").bind("change", function(event){
    uploadFiles(event.target.files);
  });

  $("#uploud_s").bind("click", function(){
    $("#uploadfile_s").trigger('click');
  });
  $("#uploadfile_s").bind("change", function(event){
    uploadFiles(event.target.files);
  });

  $("#saveitem").bind("click", function(event){

    var item = getItemData();

    if (!check_item(item)) {

      if (itemId) {

        item.id = itemId;

        smart.dopost("/item/update.json", item, function(err, result) {
          if (err) {
            smart.error(err,i18n["js.common.add.error"],false);
          } else {
            window.location = "/menu/item/list";
          }
        });
      } else {
        smart.dopost("/item/add.json", item, function(err, result) {
          if (err) {
            smart.error(err,i18n["js.common.add.error"],false);
          } else {
            window.location = "/menu/item/list";
          }
        });
      }
    }
  });

}

//取得菜品信息
function getItemData() {

  var item = {
      itemName : $("#itemName").val()
    , itemPrice : $("#itemPrice").val()
    , itemType : $("#itemType").val()
    , itemComment : $("#itemComment").val()
    , itemMaterial : $("#itemMaterial").val()
    , itemMethod : $("#itemMethod").val()
  };

  return item;
}


//更新用户
function updateItem(item) {
  smart.doput("/item/update.json", item, function(err, result){
    if (err) {
      smart.error(err,i18n["js.common.update.error"],false);
    } else {
      //更新成功返回列表
        window.location = "/menu/item/list";
    }
  });
}

function uploadFiles(files) {
  if (!files || files.length <= 0) {
    return false;
  }

  var fd = new FormData();
  for (var i = 0; i < files.length; i++) {
    fd.append("files", files[i]);
  }

  // 显示进度条
  $("#upload_progress_dlg").modal("show");

  // 发送文件
  smart.dopostData("/material/add.json", fd,
    function(err, result){

      $("#upload_progress_dlg").modal("hide");
      if(smart.error(err, i18n["js.common.upload.error"], false)){
        return;
      } else {
        render(0, 20);
        Alertify.log.success(i18n["js.common.upload.success"]);
      }
    },
    function(progress){
      $("#upload_progress_bar").css("width", progress + "%");
    }
  );
}

function render(itemId) {

  if (itemId) {

    smart.doget("/item/findOne.json?itemId=" + itemId , function(err, result) {
      if (err) {
        smart.error(err,i18n["js.common.search.error"],false);
      } else {
      $("#itemName").val(result.itemName);
      $("#itemPrice").val(result.itemPrice);
      $("#itemType").val(result.itemType);
      $("#itemComment").val(result.itemComment);
      $("#itemMaterial").val(result.itemMaterial);
      $("#itemMethod").val(result.itemMethod);

      }
    });
  }
}

function check_item(item) {
  var flag = 0;
  if (item.itemName == "") {
    Alertify.log.error(i18n["js.public.check.desk.name"]);
    flag = 1;
  }

  return flag;
}
