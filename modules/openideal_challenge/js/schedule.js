/**
 * @file
 * Attaches behaviors for the Openideal Challenge module's schedule widget.
 */

(function ($, Drupal, drupalSettings) {

  "use strict";

  /**
   * Generate default date string e.g. d/m/Y.
   *
   * @param {Date} date
   *   Date to format.
   *
   * @returns {string}
   *   Formatted string.
   */
  function generateDefaultDate(date) {
    if (!(date instanceof Date)) {
      // @Todo: throw error?
      return;
    }
    var language = drupalSettings.path.currentLanguage;
    var year = new Intl.DateTimeFormat(language, {year: 'numeric'}).format(date)
    var month = new Intl.DateTimeFormat(language, {month: '2-digit'}).format(date)
    var day = new Intl.DateTimeFormat(language, {day: '2-digit'}).format(date)
    return `${day}/${month}/${year}`;
  }
  /**
   * Schedule behaviours.
   *
   * @type {Drupal~behavior}
   *
   * @prop {Drupal~behaviorAttach} attach
   *   Attach local time to the schedule widget.
   */
  Drupal.behaviors.openidealChallengeSchedule = {
    attach: function (context, settings) {
      $('.challenge-schedule-local-machine-time').once('openideal_challenge_schedule').each(function () {
        // Format the date.
        $(this).html(Drupal.t('Your time is: @time. <br/> Leave blank to use the time of submission ("Now").',
        {
          '@time': generateDefaultDate(new Date()),
        })
        )
      })
    }
  };

  /**
   * Change html5 date input view format.
   *
   * @type {Drupal~behavior}
   *
   * @prop {Drupal~behaviorAttach} attach
   *   Attach dynamic format change to date.
   */
  Drupal.behaviors.openidealChallengeHMTL5Date = {
    attach: function (context, settings) {
      $('input[type="date"]').once('openideal_challenge_html5_date').each(function () {
        $(this).on('change', function () {
          var attribute = !this.value ? 'dd/mm/yyyy' : generateDefaultDate(new Date(this.value));
          this.setAttribute('data-date', attribute);
        }).trigger("change")
      })
    }
  }
}
)(jQuery, Drupal, drupalSettings);
