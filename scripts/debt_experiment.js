var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(["backbone"], function(Backbone) {
  return Views.DebtExperimentView = (function(_super) {

    __extends(DebtExperimentView, _super);

    function DebtExperimentView() {
      return DebtExperimentView.__super__.constructor.apply(this, arguments);
    }

    DebtExperimentView.prototype.events = {
      'click [data-action="close"]': 'close',
      'click [data-action="calculate"]': 'calculate'
    };

    DebtExperimentView.prototype.manage = true;

    DebtExperimentView.prototype.template = 'templates/experiments/debt';

    DebtExperimentView.prototype.interest = function(balance, percent) {
      var monthlyPay;
      monthlyPay = balance * percent;
      return monthlyPay / 12;
    };

    DebtExperimentView.prototype.how_long = function(balance, percent, payment) {
      var count, debtBalance, interest, percentOnDebt, totalInterest;
      percentOnDebt = percent * 0.01;
      debtBalance = balance;
      count = 0;
      totalInterest = 0;
      while (debtBalance > 0) {
        interest = this.interest(debtBalance, percentOnDebt);
        totalInterest = interest + totalInterest;
        debtBalance = debtBalance + interest;
        debtBalance = debtBalance - payment;
        count = count + 1;
      }
      return {
        interest: Math.round(totalInterest * 100) / 100,
        count: count
      };
    };

    DebtExperimentView.prototype.calculate = function(e) {
      var currentTotal, perMonth, percent, result, resultOutput;
      perMonth = parseInt(this.$('[name="per_month"]').val(), 10);
      percent = parseInt(this.$('[name="percent"]').val(), 10);
      currentTotal = parseInt(this.$('[name="current_total"]').val(), 10);
      if (perMonth && percent && currentTotal) {
        result = this.how_long(currentTotal, percent, perMonth);
        resultOutput = "<div class=\"months\" >Months: " + result.count + "</div><div class=\"interest\" >Total Interest: " + result.interest + "</div>";
        return this.$('[data-elem="results"]').html(resultOutput);
      }
    };

    DebtExperimentView.prototype.initialize = function(opts) {
      this.collection = opts.collection;
      return DebtExperimentView.__super__.initialize.apply(this, arguments);
    };

    DebtExperimentView.prototype.html = function(root, el) {
      $('#experiment').empty();
      return $(root).html(el);
    };

    DebtExperimentView.prototype.close = function(e) {
      this.remove();
      return Backbone.history.navigate('/', true);
    };

    return DebtExperimentView;

  })(Backbone.View);
});
