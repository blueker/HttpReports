﻿
GoTop();

function InitPage() {

    if (lang.Language == "English") {

        laydate.render({ elem: '.start', theme: '#67c2ef', type: 'datetime', ready: ClearTimeRange(), lang: 'en' });
        laydate.render({ elem: '.end', theme: '#67c2ef', type: 'datetime', ready: ClearTimeRange(), lang: 'en' });

    }

    if (lang.Language == "Chinese") {

        laydate.render({ elem: '.start', theme: '#67c2ef', type: 'datetime', ready: ClearTimeRange() });
        laydate.render({ elem: '.end', theme: '#67c2ef', type: 'datetime', ready: ClearTimeRange() });

    }

}  

InitPage();

InitTimeRange();

InitTable(); 
 
function GetNodes() {

    $.ajax({
        url: "/HttpReportsData/GetNodes", 
        success: function (result) {

            $(".node-row").html("");

            $.each(result.data, function (i, item) {

                $(".node-row").append(' <button onclick="check_node(this)" style="width:120px;margin-left:20px;" class="btn btn-info">' + item + '</button>');

            });
        }
    })
} 

// 初始化Table
function InitTable() {

    var start = $(".start").val().trim();
    var end = $(".end").val().trim();

    var url = "/HttpReportsData/GetRequestList?"
        + "start=" + start + "&end=" + end;

    var size = localStorage.getItem("bootstarpSize") == null ? 20 : localStorage.getItem("bootstarpSize");  

    $('#TableData').bootstrapTable({
        pageNumber: 1,
        pageSize: size,
        pageList: [10, 15, 20, 30, 50],
        url: url,
        queryParamsType: '',
        sidePagination: "server",
        pagination: true, 
        onLoadSuccess: function (data) { 
            $("#TableData").busyLoad("hide"); 
        },
        onPreBody: function (data) {

            $("#TableData").busyLoad("show", {
                color: "#000080",  
                fontawesome: "fa fa-spinner fa-spin fa-3x fa-fw",
                background: "rgba(0,0,0,0)",
            }); 
        },
        onPageChange: function (number, size) {   
            localStorage.setItem("bootstarpSize", size);
        },
        columns: [
            
            {
                field: 'node',
                title: lang.Index_ServiceNode,
                align: 'center'
            },
            {
                field: 'requestType',
                title: lang.Request_Connection,
                align: 'center'
            }, 
            {
                field: 'url',
                title: lang.Request_Url,
                align: 'left'

            },
            {
                field: 'method',
                title: lang.Request_Type,
                align: 'center'

            },
            {
                field: 'milliseconds',
                title: lang.Request_Time,
                align: 'center',
                formatter: function (value, row, index) {

                    var btn = `<span>${value}</span>`;
                    return btn;
                }

            },
            {
                field: 'statusCode',
                title: lang.Request_StatusCode,
                align: 'center'

            },
            {
                field: 'ip',
                title: lang.Request_RemoteIP,
                align: 'center'

            },

            {
                field: 'createTime',
                title: lang.Request_CreateTime,
                align: 'center',
                formatter: function (value, row, index) {

                    value = value.replace('T', ' '); 
                    return value;
                }
            },
            {
                field: 'id',
                title: lang.Request_DetailInfo,
                align: 'center',
                width: '80px',
                formatter: function (value, row, index) {

                    var btn = `<a href="#"> <i onclick="bind_context('${value}')" class="request-info fa fa-exchange" ></i></a>`;
                    return btn;
                }
            },
            {
                field: 'id',
                title: lang.Request_Trace,
                align: 'center', 
                width:'80px',
                formatter: function (value, row, index) {

                    var btn = ' <a href="Trace?Id=' + value + '" ><i class="request-trace  fa fa-space-shuttle" ></i> </a>';
                    return btn;
                }
            }
        ]
    });

}

//选择服务节点
function check_node(item) {

    if ($(item).hasClass("btn-info")) {
        $(item).removeClass("btn-info");
        $(item).addClass("btn-default");
    }
    else {
        $(item).removeClass("btn-default");
        $(item).addClass("btn-info");
    }
}

//全选
function select_all(item) {

    $(item).parent().next().find("button").each(function (i, k) {

        if ($(k).hasClass("btn-default")) {
            $(k).removeClass("btn-default");
            $(k).addClass("btn-info");
        }
    });
}

//反选
function select_reverse(item) {

    $(item).parent().next().find("button").each(function (i, k) {

        if ($(k).hasClass("btn-info")) {
            $(k).removeClass("btn-info");
            $(k).addClass("btn-default");
        }
        else {
            $(k).removeClass("btn-default");
            $(k).addClass("btn-info");
        }

    });
}

function RefreshTable() {   


    var url = "/HttpReportsData/GetRequestList";

    var start = $(".start").val().trim();
    var end = $(".end").val().trim();
    var requestUrl = $(".url").val().trim();
    var ip = $(".ipadress").val().trim();
    var statusCode = $(".statusCode").val().trim();
    var traceId = $(".traceId").val().trim(); 

    var service = $(".service-form").find(".service").find("select").val();
    var instance = $(".service-form").find(".instance").find("select").val();  

    url = url + `?start=${start}&end=${end}&url=${requestUrl}&ip=${ip}&service=${service}&instance=${instance}&statusCode=${statusCode}&traceId=${traceId}`;

    $('#TableData').bootstrapTable('refresh', { 
        url: url  
    });
}  


function bind_context(Id) {

    $.ajax({
        url: "/HttpReportsData/GetRequestInfoDetail/",
        type: "POST",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({

            Id : Id

        }),
        success: function (result) {

            var info = result.data.info;
            var detail = result.data.detail;

            $(".context_requestId").text(info.id);
            $(".context_node").text(info.node);
            $(".context_route").text(info.route);
            $(".context_url").text(info.url);
            $(".context_method").text(info.method);
            $(".context_requestType").text(info.requestType); 
            $(".context_milliseconds").text(info.milliseconds);
            $(".context_statusCode").text(info.statusCode);
            $(".context_ip").text(info.ip);
            $(".context_port").text(info.port);
            $(".context_localIp").text(info.localIP);
            $(".context_localPort").text(info.localPort);
            $(".context_createTime").text(info.createTime);

            $(".context_queryString").text(detail.queryString);
            $(".context_header").text(detail.header);
            $(".context_cookie").text(detail.cookie);
            $(".context_requestBody").text(detail.requestBody);
            $(".context_responseBody").text(detail.responseBody);
            $(".context_error").text(detail.errorMessage);
            $(".context_errorStack").text(detail.errorStack);


            show_modal();
        }
    });

} 

function show_modal() {

  
    $(".contextBox").show();
    new mSlider({
        dom: ".contextBox",
        distance: "40%",
        direction: "left",
        callback: function () {
            $(".contextBox").hide();
            $(".contextBox").getNiceScroll().remove();
            
        }
    }).open();


    $('.contextBox').niceScroll({
        cursorcolor: "#ccc",
        cursoropacitymax: 1,
        touchbehavior: false,
        cursorwidth: "3px",
        cursorborder: "0",
        cursorborderradius: "5px",
        autohidemode: false
    });
}

function QueryClick() {

    RefreshTime(); 

    if ($(".start").val().trim().length == 0 || $(".end").val().trim().length == 0) {

        alertWarn(lang.TimeNotNull);
        return;

    } 

    RefreshTable();

}  
 