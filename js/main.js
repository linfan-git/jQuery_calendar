/**
 * @class 日历组件
 * @param {string} container 容器id
 */
var DatePicker = function (container) {
  this.container = $(container);
  this.mainDiv = null;
  this.selectedEle = null;
  this.selectedDate = new Date();
  this.currentDate = new Date();
  this.init();
};

DatePicker.prototype = {
  days: ['日', '一', '二', '三', '四', '五', '六'],

  init: function () {
    var self = this;

    var mainDiv = $('<div>')
      .css('position', 'relative')
      .appendTo(this.container);

    this.mainDiv = mainDiv;

    var input = $('<input>')
      .attr('readonly', 'true')
      .css('width', '240px')
      .css('height', '30px')
      .css('text-align', 'center')
      .click(function () {
        calendar.fadeToggle(function () {
          if (calendar.is(':visible')) {
            self.renderByDate(self.selectedDate);
            self.currentDate = new Date(self.selectedDate);
          }
        });
      })
      .appendTo(mainDiv);

    //点选日期事件
    var calendarClicked = function (e) {
      if ($(e.target).is('span:gt(6)')) {
        var allSpan = self.mainDiv.find('span');
        var index = allSpan.index($(e.target));
        var selectedIndex = allSpan.index(self.selectedEle);

        self.currentDate.setDate(self.currentDate.getDate() + index - selectedIndex);
        self.selectedDate = new Date(self.currentDate);
        input.val(self.toStringDate(self.currentDate, true)).click();
      }
    };

    //日历框
    var calendar = $('<div>')
      .css('padding', '15px')
      .css('position', 'absolute')
      .css('top', '34px')
      .css('width', '240px')
      .css('height', '304px')
      .css('box-shadow', '2px 2px 15px 2px #e3e3e3')
      .css('text-align', 'center')
      .css('z-index', '100')
      .click(calendarClicked)
      .hide()
      .appendTo(mainDiv);

    //点击页面非日历区隐藏日历
    $(document).click(function () {
      calendar.fadeOut();
    });

    mainDiv.click(function (e) {
      e.stopPropagation();
    });

    //标题
    var hdDiv = $('<div>')
      .css('height', '34px')
      .css('line-height', '34px')
      .css('font-size', '14px')
      .appendTo(calendar);

    var title = $('<strong>').addClass('title').appendTo(hdDiv);

    //年、月前后按钮
    var preYear = $('<strong>')
      .html('&lt&lt')
      .css('float', 'left')
      .css('cursor', 'pointer')
      .click(function () {
        self.preYear();
      })
      .appendTo(hdDiv);

    var preMonth = $('<strong>')
      .html('&lt')
      .css('margin', '0 10px')
      .css('float', 'left')
      .css('cursor', 'pointer')
      .click(function () {
        self.preMonth();
      })
      .appendTo(hdDiv);

    var nextYear = $('<strong>')
      .html('&gt&gt')
      .css('float', 'right')
      .css('cursor', 'pointer')
      .click(function () {
        self.nextYear();
      })
      .appendTo(hdDiv);

    var nextMonth = $('<strong>')
      .html('&gt')
      .css('margin', '0 10px')
      .css('float', 'right')
      .css('cursor', 'pointer')
      .click(function () {
        self.nextMonth();
      })
      .appendTo(hdDiv);

    //固定的星期
    for (var i = 0; i < 7; i++) {
      var ele = this.createEle().html(this.days[i]).appendTo(calendar);
      if (i === 0 || i === 6) {
        ele.css('color', '#ee7777');
      }
    }

    //日期
    for (var i = 0; i < 42; i++) {
      var el = this.createEle()
        .css('border-radius', '50%')
        .css('cursor', 'pointer')
        .appendTo(calendar);
    }

    //底部按钮
    var btnDiv = $('<div>')
      .css('height', '30px')
      .css('line-height', '30px')
      .appendTo(calendar);

    var btnSure = $("<input type='button' value='确定'>")
      .addClass('btn')
      .click(function () {
        self.selectedDate = new Date(self.currentDate);
        input.val(self.toStringDate(self.selectedDate, true)).click();
      })
      .appendTo(btnDiv);

    var btnToday = $("<input type='button' value='今天'>")
      .addClass('btn')
      .click(function () {
        self.selectedDate = new Date();
        input.val(self.toStringDate(self.selectedDate, true)).click();
      })
      .appendTo(btnDiv);

    var btnClear = $("<input type='button' value='清除'>")
      .addClass('btn')
      .click(function () {
        input.val('');
        self.selectedDate = new Date();
      })
      .appendTo(btnDiv);

    btnDiv.find('.btn')
      .css('float', 'right')
      .css('margin-left', '4px')
      .css('width', '40px')
      .css('height', '30px')
      .css('color', '#333')
      .css('border', 'none')
      .css('outline', 'none')
      .css('background-color', '#e2e4ec')
      .css('cursor', 'pointer');

    this.renderByDate(this.selectedDate);
  },

  //创造日期元素
  createEle: function () {
    var ele = $('<span>')
      .css('display', 'block')
      .css('float', 'left')
      .css('width', '30px')
      .css('height', '30px')
      .css('line-height', '30px');
    return ele;
  },

  //转化成字符串日期格式
  toStringDate: function (date, full) {
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    var d = date.getDate();
    if (full) {
      return y + '年' + (m < 10 ? '0' + m : m) + '月' + (d < 10 ? '0' + d : d) + '日';
    } else {
      return y + '年' + (m < 10 ? '0' + m : m) + '月';
    }
  },

  renderByDate: function (date) {
    this.mainDiv.find('.title').html(this.toStringDate(date));

    //找到第一个日期
    var dat = new Date(date);
    dat.setDate(1);
    dat.setDate(dat.getDate() - dat.getDay());

    var allSpan = this.mainDiv.find('span');
    for (var i = 0; i < 42; i++) {
      //清除之前样式
      var ele = $(allSpan.get(i + 7))
        .html(dat.getDate())
        .css('color', '')
        .css('background-color', '');
      //周六、日颜色变红
      if (dat.getDay() === 0 || dat.getDay() === 6) {
        ele.css('color', '#ee7777');
      }
      //非当月颜色变淡
      if (dat.getMonth() !== date.getMonth()) {
        ele.css('color', '#c0c0c0');
      }
      //选中的日期背景变绿
      if (dat.getTime() === date.getTime()) {
        ele.css('background-color', '#5ec030').css('color', '#fff');
        this.selectedEle = ele;
      }
      dat.setDate(dat.getDate() + 1);
    }
  },

  //年、月前后按钮事件
  preYear: function () {
    this.currentDate.setFullYear(this.currentDate.getFullYear() - 1);
    this.renderByDate(this.currentDate);
  },

  nextYear: function () {
    this.currentDate.setFullYear(this.currentDate.getFullYear() + 1);
    this.renderByDate(this.currentDate);
  },

  preMonth: function () {
    this.currentDate.setMonth(this.currentDate.getMonth() - 1);
    this.renderByDate(this.currentDate);
  },

  nextMonth: function () {
    this.currentDate.setMonth(this.currentDate.getMonth() + 1);
    this.renderByDate(this.currentDate);
  }
};

//实例化
var datePicker = new DatePicker('#container');

