[#ftl output_format="HTML"]
[#import "common/inputs.ftl" as input]
[#import "common/translations.ftl" as translations]

<!DOCTYPE html>
<html lang="et">
  <head>
    <title>Clusterfinder</title>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css"
          integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">
    <script src="https://code.jquery.com/jquery-3.5.1.min.js" integrity="sha256-9/aliU8dGd2tb6OSsuzixeV4y/faTqgFtohetphbbj0=" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js" integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1" crossorigin="anonymous"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>
    <script src="//cdnjs.cloudflare.com/ajax/libs/list.js/1.5.0/list.min.js"></script>
    <!-- TODO: Separate global styles to a separate CSS file -->
    <!-- TODO: Add support for other devices (tablets) -->
    <style>
      html, body {
        background: transparent;
      }

      .hidden {
        display: none;
      }

      h5 {
        margin-bottom: 5px;
        margin-top: 5px;
      }

      .btn-primary {
        margin-top: 10px;
      }

      .spinner-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: darkgray;
        opacity: .5;
      }

      .centered-spinner {
        position: fixed;
        top: 45%;
        left: 45%;
      }

      .no-results-row {
        text-align: center;
        display: none;
      }

      .w-top-margin {
        margin-top: 25px;
      }

      .w-separation {
        margin-top: 10px;
        margin-bottom: 10px;
      }

      .label-w-top-margin {
        margin-top: 15px;
      }

      .large-spinner {
        width: 3rem;
        height: 3rem;
      }
    </style>
  </head>
  <body>
    <div class="container">

      <div class="row">
        <div class="col-12">
          <h2>[@translations.retrieveTranslation "clusterfinder.app.title" /]</h2>
          <p class="lead">[@translations.retrieveTranslation "clusterfinder.app.short.description" /]</p>
        </div>
      </div>

      <form id="cluster-form">
        <input type="hidden" name="formId" id="formId" value="${formId!}">
        <input type="hidden" name="fileName" id="fileName" value="">
        <input type="hidden" name="inputType" id="inputType" value="FREE_TEXT">

        <div class="form-group">
          <label for="analysisLength">[@translations.retrieveTranslation "common.analysis.length.label" /]</label>
          <select id="analysisLength" name="analysisLength" class="form-control">
              <option value="">[@translations.retrieveTranslation "common.select.one.analysis.length" /]</option>
            [#list 1..5 as length]
              <option value="${length!}">${length!}</option>
            [/#list]
          </select>
        </div>

        <!-- Input type selection -->
        <h5>[@translations.retrieveTranslation "common.input.type.header" /]</h5>
        <div class="form-group">
            <label for="userText">[@translations.retrieveTranslation "common.text.input.label" /]</label>
            <textarea class="form-control" rows="5" name="userText" id="userText"></textarea>
        </div>
        <div id="fileText" class="custom-file w-separation">
            <input type="file" class="custom-file-input" id="userFile">
            <label class="custom-file-label" for="userFile">[@translations.retrieveTranslation "common.choose.file" /]</label>
        </div>

        <!-- Basic search checkboxes -->
        <h5>[@translations.retrieveTranslation "common.analysis.header" /]</h5>
        <div class="form-check">
          [@input.createCheckboxWithTooltip
              id="morfoAnalysis"
              name="morfological"
              labelKey="morfological.analysis.label"
              tooltipKey="morfological.analysis.tooltip" /]
        </div>
        <div class="form-check">
          [@input.createCheckboxWithTooltip
              id="syntacticAnalysis"
              name="syntactic"
              labelKey="syntactic.analysis.label"
              tooltipKey="syntactic.analysis.tooltip" /]
        </div>
        <div class="form-check">
          [@input.createCheckboxWithTooltip
              id="wordtypeAnalysis"
              name="wordtype"
              labelKey="wordtype.analysis.label"
              tooltipKey="wordtype.analysis.tooltip" /]
        </div>
        <div class="form-check">
          [@input.createCheckboxWithTooltip
              id="punctuationAnalysis"
              name="punctuation"
              labelKey="punctuation.analysis.label"
              tooltipKey="punctuation.analysis.tooltip" /]
        </div>

        <!-- Sorting checkboxes -->
        <h5>[@translations.retrieveTranslation "common.sorting.header" /]</h5>
        <div class="form-check">
          [@input.createCheckbox id="sortByFreq" name="sorting" labelKey="sorting.by.frequency" value="freq" /]
        </div>
        <div class="form-check hidden" data-word-sort="1">
          [@input.createCheckbox id="sortByFirstWord" name="sorting" labelKey="sorting.by.first.word" value="fwrd" /]
        </div>
        <div class="form-check hidden" data-word-sort="2">
          [@input.createCheckbox id="sortBySecondWord" name="sorting" labelKey="sorting.by.second.word" value="swrd" /]
        </div>
        <div class="form-check hidden" data-word-sort="3">
          [@input.createCheckbox id="sortByThirdWord" name="sorting" labelKey="sorting.by.third.word" value="twrd" /]
        </div>
        <div class="form-check hidden" data-word-sort="4">
          [@input.createCheckbox id="sortByFourthWord" name="sorting" labelKey="sorting.by.fourth.word" value="fowrd" /]
        </div>
        <div class="form-check hidden" data-word-sort="5">
          [@input.createCheckbox id="sortByFifthWord" name="sorting" labelKey="sorting.by.fifth.word" value="fiwrd" /]
        </div>

        [#include "form/clauseTypeFragment.ftl" ]

        [#include "form/wordTypeFragment.ftl" ]

        <button id="submitBtn" type="submit" class="btn btn-primary">[@translations.retrieveTranslation "common.search" /]</button>
      </form>
    </div>

    <!-- Results section -->
    <div id="clusters" class="container hidden">
      <table class="table table-bordered w-top-margin" id="clustersTable">
        <thead>
          <tr>
            <th class="sort" data-sort="frequency">[@translations.retrieveTranslation "common.sorting.header.frequency"/]</th>
            <th class="sort" data-sort="description">[@translations.retrieveTranslation "common.sorting.header.description" /]</th>
            <th class="sort" data-sort="markups">[@translations.retrieveTranslation "common.sorting.header.markups" /]</th>
            <th class="sort" data-sort="usages">[@translations.retrieveTranslation "common.sorting.header.usages" /]</th>
          </tr>
        </thead>
        <tbody class="list">
          <tr class="no-results-row">
            <td colspan="4">[@translations.retrieveTranslation "common.no.results" /]</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Loading spinner -->
    <div id="loadingSpinner" class="spinner-overlay hidden text-center">
      <div class="spinner-border centered-spinner text-primary large-spinner" role="status">
        <span class="sr-only">[@translations.retrieveTranslation "common.loading.text" /]</span>
      </div>
    </div>
  </body>
  <script>
    const ClusterSearchForm = {

      SORTING_OPTIONS: undefined,
      CLUSTERS_LIST: undefined,
      OPTIONS: {
        valueNames: ["frequency", "description", "markups", "usages"],
        item: '<tr>' +
                '<td class="frequency"></td>' +
                '<td class="description"></td>' +
                '<td class="markups"></td>' +
                '<td class="usages"></td>' +
              '</tr>'
      },

      init: function () {
        ClusterSearchForm.clauseType.init();
        ClusterSearchForm.wordType.init();
        ClusterSearchForm.prepareSortingOptions();
        ClusterSearchForm.initSortingCheckboxes();

        $("#analysisLength").change(ClusterSearchForm.handleAnalysisLengthChange);

        // Initialize tooltips
        $('[data-toggle="tooltip"]').tooltip()

        // Initially hide all the additional option containers
        $(".additionals-container").hide();

        // File upload initialization
        $("#userFile").change(ClusterSearchForm.ajax.uploadFile);

        $("#morfoAnalysis, #syntacticAnalysis, #punctuationAnalysis").change(function () {
          $("#wordtypeAnalysis").prop("checked", false);
        });

        $("#morfoAnalysis, #syntacticAnalysis").change(function() {
          ClusterSearchForm.helpers.hideAndResetDropdowns();
          if (ClusterSearchForm.helpers.isComponentSortingSelected()) {
            ClusterSearchForm.handleComponentSortingSelection();
          }
        });

        $("#wordtypeAnalysis").change(ClusterSearchForm.handleWordTypeAnalysisChange);

        $("#submitBtn").click(ClusterSearchForm.ajax.clusterText);
      },

      prepareSortingOptions: function() {
         const $sortingByFirst = $("div[data-word-sort='1']");
         const $sortingBySecond = $("div[data-word-sort='2']");
         const $sortingByThird = $("div[data-word-sort='3']");
         const $sortingByFourth = $("div[data-word-sort='4']");
         const $sortingByFifth = $("div[data-word-sort='5']");

         // Constructing an object containing references to different option selector, for better accessability
         ClusterSearchForm.SORTING_OPTIONS = {
           "1": [$sortingByFirst],
           "2": [$sortingByFirst, $sortingBySecond],
           "3": [$sortingByFirst, $sortingBySecond, $sortingByThird],
           "4": [$sortingByFirst, $sortingBySecond, $sortingByThird, $sortingByFourth],
           "5": [$sortingByFirst, $sortingBySecond, $sortingByThird, $sortingByFourth, $sortingByFifth]
         };
      },

      initSortingCheckboxes: function() {
        $("input[name='sorting']").change(function () {
          // Uncheck other options
          $("input[name='sorting']").not(this).prop("checked", false);

          if (ClusterSearchForm.helpers.isComponentSortingSelected()) {
            ClusterSearchForm.handleComponentSortingSelection();
          } else {
            ClusterSearchForm.helpers.hideAndResetDropdowns();
          }
        });
      },

      handleComponentSortingSelection: function() {
        const isMorfo = $("#morfoAnalysis").is(":checked");
        const isSyntactic = $("#syntacticAnalysis").is(":checked");
        const isWordType = $("#wordtypeAnalysis").is(":checked");
        const isMorfoSyntatctic = isMorfo && isSyntactic;

        if (isMorfoSyntatctic) {
          $("#wordTypeSelectContainer").show();
          $("#clauseTypeSelectContainer").show();
        } else if (isMorfo) {
          $("#clauseTypeSelectContainer").hide();
          $("#wordTypeSelectContainer").show();
        } else if (isSyntactic) {
          $("#wordTypeSelectContainer").hide();
          $("#clauseTypeSelectContainer").show();
        } else if (isWordType) {
          $("#wordTypeSelectContainer").show();
          $("#clauseTypeSelectContainer").hide();
        } else {
          $("#clauseTypeSelectContainer").hide();
          $("#wordTypeSelectContainer").hide();
        }
      },

      handleAnalysisLengthChange: function() {
        ClusterSearchForm.helpers.hideAndResetWordSortingCheckboxes();
        if ($(this).val() !== "") {
          ClusterSearchForm.SORTING_OPTIONS[$(this).val()].forEach(element => element.show())
        }
      },

      handleWordTypeAnalysisChange: function() {
        $("#morfoAnalysis").prop("checked", false);
        $("#syntacticAnalysis").prop("checked", false);
        $("#punctuationAnalysis").prop("checked", false);

        ClusterSearchForm.helpers.hideAndResetDropdowns();
        if (ClusterSearchForm.helpers.isComponentSortingSelected()) {
          ClusterSearchForm.handleComponentSortingSelection();
        }
      },

      clauseType: {
        QUANTIFIER_ADDITIONAL_OPTIONS: $("#quantifier"),
        PREDICATE_ADDITIONAL_OPTIONS: $("#predicate"),
        PREPOSITION_ADDITIONAL_OPTIONS: $("#preposition"),
        ATTRIBUTE_ADDITIONAL_OPTIONS: $("#attribute"),

        init: function () {
          $("#clauseTypeDropdown option[value='ALL']").click();
          $(".clause-additionals-container").hide();
          $("#clauseTypeDropdown").change(ClusterSearchForm.clauseType.toggleAdditionalOptions);
        },

        toggleAdditionalOptions: function () {
          const selectedValue = $("#clauseTypeDropdown").val();
          if (selectedValue === "ALL") {
            $("div.clause-additionals-container").hide();
            $("div.clause-additionals-container").find("input[type='checkbox']").prop("checked", false);
          } else {
            $("div.clause-additionals-container:not([data-clause-group='"+ selectedValue + "'])").hide();
            $("div.clause-additionals-container:not([data-clause-group='"+ selectedValue + "'])").find("input[type='checkbox']").prop("checked", false);
            $("div.clause-additionals-container[data-clause-group='"+ selectedValue +"']").show();
          }
        }
      },

      wordType: {
        init: function() {
          $("#wordTypeDropdown option[value='ALL']").click();
          ClusterSearchForm.wordType.verb.init();
          ClusterSearchForm.wordType.adjective.init();
          ClusterSearchForm.wordType.pronoun.init();
          ClusterSearchForm.wordType.numeral.init();
          $("#wordTypeDropdown").change(ClusterSearchForm.wordType.toggleAdditionalFields);
        },


        toggleAdditionalFields: function () {
          // Additional options can only be shown when the word type analysis is not selected
          const selectedValue = $("#wordTypeDropdown").val();
          const wordTypeAnalysisSelected = $("#wordtypeAnalysis").is(":checked");

          // Hide other additional option checkboxes and show the correct ones
          if (selectedValue === "ALL" || wordTypeAnalysisSelected) {
            $("div.additionals-container").hide();
            $("div.additionals-container").find("input[type='checkbox']").prop("checked", false);
          } else {
            $("div.additionals-container:not([data-group='"+ selectedValue + "'])").hide();
            $("div.additionals-container:not([data-group='"+ selectedValue + "'])").find("input[type='checkbox']").prop("checked", false);
            $("div[data-group='"+ selectedValue +"']").show();
          }
        },

        verb: {
          VERB_FINITE_TYPE_ADDITIONAL_FIELDS: $("div[data-subgroup='VP']"),
          VERB_NON_FINITE_TYPE_ADDITIONAL_FIELDS: $("div[data-subgroup='VK']"),
          VERB_NON_FINITE_TYPE_PARTIC_ADDITIONAL_FIELDS: $("#verbSubTypeVKParticAdditionals"),
          VERB_NON_FINITE_TYPE_SUP_ADDITIONAL_FIELDS: $("#verbSubTypeVKSupAdditionals"),

          init: function () {
            ClusterSearchForm.wordType.verb.VERB_NON_FINITE_TYPE_ADDITIONAL_FIELDS.hide();
            ClusterSearchForm.wordType.verb.VERB_FINITE_TYPE_ADDITIONAL_FIELDS.hide();
            ClusterSearchForm.wordType.verb.initFiniteTypeHandlers();
            ClusterSearchForm.wordType.verb.initSubTypeHandlers();
          },

          initFiniteTypeHandlers: function() {
            $("#verbFiniteTypeP").change(function () {
              if($(this).is(":checked")) {
                ClusterSearchForm.wordType.verb.VERB_FINITE_TYPE_ADDITIONAL_FIELDS.show();
                ClusterSearchForm.helpers.resetAndHideWordTypeAdditionalOptions(ClusterSearchForm.wordType.verb.VERB_NON_FINITE_TYPE_ADDITIONAL_FIELDS);
                $("#verbFiniteTypeK").prop("checked", false).change();
              } else {
                ClusterSearchForm.helpers.resetAndHideWordTypeAdditionalOptions(ClusterSearchForm.wordType.verb.VERB_FINITE_TYPE_ADDITIONAL_FIELDS);
              }
            });

            $("#verbFiniteTypeK").change(function () {
              if($(this).is(":checked")) {
                ClusterSearchForm.wordType.verb.VERB_NON_FINITE_TYPE_ADDITIONAL_FIELDS.show();
                ClusterSearchForm.helpers.resetAndHideWordTypeAdditionalOptions(ClusterSearchForm.wordType.verb.VERB_FINITE_TYPE_ADDITIONAL_FIELDS);
                $("#verbFiniteTypeP").prop("checked", false).change();
              } else {
                ClusterSearchForm.helpers.resetAndHideWordTypeAdditionalOptions(ClusterSearchForm.wordType.verb.VERB_NON_FINITE_TYPE_ADDITIONAL_FIELDS);
              }
            });
          },

          initSubTypeHandlers: function() {
            $("#verbSubTypeVKPartic").change(function () {
              if ($(this).is(":checked")) {
                ClusterSearchForm.wordType.verb.VERB_NON_FINITE_TYPE_PARTIC_ADDITIONAL_FIELDS.show();
              } else {
                ClusterSearchForm.helpers.resetAndHideWordTypeAdditionalOptions(ClusterSearchForm.wordType.verb.VERB_NON_FINITE_TYPE_PARTIC_ADDITIONAL_FIELDS);
              }
            });

            $("#verbSubTypeVKSup").change(function() {
              if ($(this).is(":checked")) {
                ClusterSearchForm.wordType.verb.VERB_NON_FINITE_TYPE_SUP_ADDITIONAL_FIELDS.show();
              } else {
                ClusterSearchForm.helpers.resetAndHideWordTypeAdditionalOptions(ClusterSearchForm.wordType.verb.VERB_NON_FINITE_TYPE_SUP_ADDITIONAL_FIELDS);
              }
            });
          }
        },

        adjective: {
          SUB_TYPE_ADDITIONAL_FIELDS: $("#adjectiveSubTypeAdditionals"),

          init: function() {
            ClusterSearchForm.wordType.adjective.SUB_TYPE_ADDITIONAL_FIELDS.hide();

            $("#adjectiveSubTypeA").change(function() {
              if($(this).is(":checked")) {
                ClusterSearchForm.wordType.adjective.SUB_TYPE_ADDITIONAL_FIELDS.show();
                $("#adjectiveSubTypeG").prop("checked", false);
              } else {
                ClusterSearchForm.helpers.resetAndHideWordTypeAdditionalOptions(ClusterSearchForm.wordType.adjective.SUB_TYPE_ADDITIONAL_FIELDS);
              }
            });

            $("#adjectiveSubTypeG").change(function () {
              if($(this).is(":checked")) {
                ClusterSearchForm.helpers.resetAndHideWordTypeAdditionalOptions(ClusterSearchForm.wordType.adjective.SUB_TYPE_ADDITIONAL_FIELDS);
                $("#adjectiveSubTypeA").prop("checked", false);
              }
            })
          },
        },

        pronoun: {
          SUB_TYPE_ADDITIONAL_FIELDS: $("#pronounSubTypeAdditionals"),

          init: function() {
            ClusterSearchForm.wordType.pronoun.SUB_TYPE_ADDITIONAL_FIELDS.hide();

            $("#pronounSubTypePers").change(function() {
              if($(this).is(":checked")) {
                ClusterSearchForm.wordType.pronoun.SUB_TYPE_ADDITIONAL_FIELDS.show();
              } else {
                ClusterSearchForm.helpers.resetAndHideWordTypeAdditionalOptions(ClusterSearchForm.wordType.pronoun.SUB_TYPE_ADDITIONAL_FIELDS);
              }
            });
          }
        },

        numeral: {
          SUB_TYPE_ADDITIONAL_FIELDS: $("#numeralSubTypeAdditionals"),

          init: function () {
            ClusterSearchForm.wordType.numeral.SUB_TYPE_ADDITIONAL_FIELDS.hide();

            $("#numeralSubTypeCard, #numeralSubTypeOrd").change(function () {
              if($(this).is(":checked")) {
                ClusterSearchForm.wordType.numeral.SUB_TYPE_ADDITIONAL_FIELDS.show();
              } else {
                ClusterSearchForm.helpers.resetAndHideWordTypeAdditionalOptions(ClusterSearchForm.wordType.numeral.SUB_TYPE_ADDITIONAL_FIELDS);
              }
            });
          }
        }
      },

      ajax: {
        clusterText: function (e) {
          e.preventDefault();
          const data = $("#cluster-form").serializeArray();

          $.ajax({
            method: "POST",
            url: "${ajaxUrls.clusterText}",
            data: data,
            beforeSend: function() {
              ClusterSearchForm.ajax.resetTable();
              $(".no-results-row").hide();
              $("#clusters").hide();
              ClusterSearchForm.loader.showLoadingSpinner();
            },
            success: function (response) {
              if (response.clusters.length > 0) {
                console.log(response.separator);
                ClusterSearchForm.ajax.showResults(response.clusters, response.separator);
              } else {
                ClusterSearchForm.ajax.showNoResults();
              }
            },
            error: function (error) {
              ClusterSearchForm.ajax.showNoResults();
            },
            complete: function () {
              ClusterSearchForm.loader.hideLoadingSpinner();
            }
          });
        },

        showResults: function(data, separator) {
          const clusters = [];
          for ( let i = 0; i < data.length; i++)
          {
            const cluster = {
              frequency: data[i].frequency,
              description: data[i].descriptions.join(" " + separator + " "),
              markups: data[i].markups.map(ClusterSearchForm.util.escapeValueAndReplace).join(" " + separator + " "),
              usages: data[i].usages.join(", ")
            };

            clusters.push(cluster);
          }

          ClusterSearchForm.CLUSTERS_LIST = new List("clustersTable", ClusterSearchForm.OPTIONS, clusters);
          $("#clusters").show();
        },

        showNoResults: function () {
          $("#clusters").show();
          $(".no-results-row").show();
        },

        resetTable: function () {
          if (ClusterSearchForm.CLUSTERS_LIST) {
            ClusterSearchForm.CLUSTERS_LIST.clear();
          }
        },

        uploadFile: function (event) {
          const file = event.target.files[0];
          const formData = new FormData();
          formData.append("file", file);

          $.ajax({
            method: "POST",
            url: "${ajaxUrls.uploadFile}",
            data: formData,
            processData: false,
            contentType: false,
            success: function(data) {
              // Update the form's hidden parameter
              $("#fileName").val(file.name);
              $(".custom-file-label").html(file.name);
              $("#inputType").val("FILE_BASED_TEXT");
            },
            error: function(data) {
              // Empty the value
              // TODO: Add notification displaying support for this
              $("#fileName").val("");
              $(".custom-file-label").html("[@translations.retrieveTranslation "common.choose.file" /]");
              $("#inputType").val("FREE_TEXT");
            }
          });
        }
      },

      loader: {
        showLoadingSpinner: function() {
          $("#loadingSpinner").show();
        },

        hideLoadingSpinner: function () {
          $("#loadingSpinner").hide();
        }
      },

      helpers: {
        isComponentSortingSelected: function() {
          const selectedValue = $("input[name='sorting']:checked").val();
          return selectedValue === "fwrd" ||
                 selectedValue === "swrd" ||
                 selectedValue === "twrd" ||
                 selectedValue === "fowrd" ||
                 selectedValue === "fiwrd";
        },

        hideAndResetWordSortingCheckboxes: function() {
          ClusterSearchForm.SORTING_OPTIONS["5"].forEach(element => element.hide().find("input[type='checkbox']").prop("checked", false).change());
        },

        hideAndResetDropdowns: function () {
          // Word type
          $("#wordTypeSelectContainer").hide();
          $("#wordTypeDropdown").val("ALL").trigger("change");

          // Clause type
          $("#clauseTypeSelectContainer").hide();
          $("#clauseTypeDropdown").val("ALL").trigger("change");
        },

        resetAndHideWordTypeAdditionalOptions: function (additionalsSelector) {
          $(additionalsSelector).find("input[type='checkbox']").prop("checked", false);
          $(additionalsSelector).hide();
        }
      },

      util: {
        escapeValueAndReplace: function (unsafeValue) {
          return unsafeValue
                  .replace(/</g, "&lt;")
                  .replace(/>/g, "&gt;")
                  .replace(/_/g, "");
        }
      }
    };
    $(document).ready(ClusterSearchForm.init);
  </script>
</html>