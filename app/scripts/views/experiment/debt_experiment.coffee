# **Debt is Evil** is a simple experiment to illustrate debt payoff calculations based
# on a per month payment, percent and a total. It responds with the length of time it will take to
# pay off the amount
View = require 'scripts/views/base/view'
template = require 'templates/experiments/debt'


module.exports = class DebtExperimentView extends View

  events:
    'click [data-action="close"]'     : 'close'
    'click [data-action="calculate"]' : 'calculate'

  autoRender: true
  template: template
  template = null
  
  # just calculates interest
  interest: (balance, percent) ->
    monthlyPay = balance * percent
    (monthlyPay / 12)


  # figures out how long based on calling @interest to calculate
  # compounding interest, monthly payment, etc...
  how_long: (balance, percent, payment) ->
    percentOnDebt = percent * 0.01
    debtBalance = balance
    count = 0
    totalInterest = 0
    # Loop through until the balance is 0
    # creating a summation of the period count
    while (debtBalance > 0)
      # TODO create graph using d3, month to month view
      # Calculate current interest via a compound schedule
      interest = @interest(debtBalance, percentOnDebt)
      # total interest paid
      totalInterest = (interest + totalInterest)
      debtBalance = (debtBalance + interest)
      debtBalance = (debtBalance - payment)
      count = count + 1

    # Round the total interest to only have 2 decimal places
    {
      interest: (Math.round(totalInterest*100)/100),
      count: count
    }

  # Main method to calculate debt
  calculate: (e) ->
    # #. Get the per month, percent and the total from the inputs
    # The values are passed through parseInt so the interpreter will not
    # try any funny business with the numbers and treat them like ints
    perMonth = parseInt(@$('[name="per_month"]').val(),10)
    percent = parseInt(@$('[name="percent"]').val(),10)
    currentTotal = parseInt(@$('[name="current_total"]').val(),10)
    # #. Update the result div with details
    if perMonth && percent && currentTotal
      result = @how_long(currentTotal, percent, perMonth)
      resultOutput = "<div class=\"months\" >Months: #{result.count}</div><div class=\"interest\" >Total Interest: #{result.interest}</div>"
      @$('[data-elem="results"]').html(resultOutput)