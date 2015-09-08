/*
 * European Variation Archive (EVA) - Open-access database of all types of genetic
 * variation data from all species
 *
 * Copyright 2014, 2015 EMBL - European Bioinformatics Institute
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function EvaAnnotationPanel(args) {
    _.extend(this, Backbone.Events);
    this.id = Utils.genId("ClinVarSummaryDataPanel");

    this.target;
    this.title = "Stats";
    this.height = 500;
    this.autoRender = true;
    _.extend(this, args);

    this.on(this.handlers);

    this.rendered = false;

    if (this.autoRender) {
        this.render();
    }
}

EvaAnnotationPanel.prototype = {
    render: function () {
        var _this = this;

        //HTML skel
        this.div = document.createElement('div');
        this.div.setAttribute('id', this.id);

        this.panel = this._createPanel();

    },
    draw: function () {
        this.targetDiv = (this.target instanceof HTMLElement ) ? this.target : document.querySelector('#' + this.target);
        if (!this.targetDiv) {
            console.log('target not found');
            return;
        }

        this.targetDiv.appendChild(this.div);
        this.panel.render(this.div);

    },
    clear: function () {
        this.annotContainer.removeAll(true);
    },
    load: function (data,params) {
        var _this = this;
        this.clear();
        var panels = [];
//        var summaryPanel = this._createSummaryPanel(data.clinvarList);
//        var clinvarList = data.clinvarList;
//        for (var key in clinvarList) {
//            var summaryData = clinvarList[key];
//            var summaryPanel = this._createSummaryPanel(summaryData);
//            panels.push(summaryPanel);
//        }
//        this.summaryContainer.removeAll();
//        this.summaryContainer.add(panels);

          var annotData = data.annot;
          console.log(annotData)

            if(!_.isUndefined(params)){
                var annText = _.findWhere(annotation_text, {species:  params.species})
               if(!_.isEmpty(annText.text)){
                   var tooltip =  annText.text;
                   Ext.getCmp('annotationStats').update('<h4>Annotations <img class="title-header-icon" data-qtip="'+tooltip+'" style="margin-bottom:2px;" src="img/icon-info.png"/></h4>')
               }else{
                   Ext.getCmp('annotationStats').update('<h4>Annotations</h4>')
               }
            }
          var panel = this._createAnnotPanel(annotData);
          this.annotContainer.removeAll();
          this.annotContainer.add(panel);


    },
    _createPanel: function () {
        this.annotContainer = Ext.create('Ext.container.Container', {
            layout: {
//                type: 'accordion',
                type: 'vbox',
                titleCollapse: true,
//                fill: false,
                multi: true
            }
        });

      this.panel = Ext.create('Ext.container.Container', {
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            overflowY: true,
            padding: 10,
            items: [
                {
                    xtype: 'box',
                    id:'annotationStats',
                    cls: 'ocb-header-4',
                    html: '<h4>Annotations</h4>',
                    margin: '5 0 10 10'
                },
                this.annotContainer
            ],
            height: this.height
        });
        return this.panel;
    },
    _createAnnotPanel: function (data) {

        console.log(data)

        var _this = this;

        var annotData = '';
        if(!_.isUndefined(data)){
            annotData = data.consequenceTypes;
        }

        console.log(annotData)
        if(annotData){
            var annotColumns = {
                items:[
                    {
                        text: "Ensembl<br /> Gene ID",
                        dataIndex: "ensemblGeneId",
                        flex: 1.2,
                        xtype: "templatecolumn",
                        tpl: '<tpl><a href="http://www.ensembl.org/Homo_sapiens/Gene/Summary?g={ensemblGeneId}" target="_blank">{ensemblGeneId}</a>',
                    },
                    {
                        text: "Ensembl <br /> Gene Symbol",
                        dataIndex: "geneName",
                        flex: 0.9
                    },
                    {
                        text: "Ensembl <br />Transcript ID",
                        dataIndex: "ensemblTranscriptId",
                        flex: 1.3,
                        xtype: "templatecolumn",
                        tpl: '<tpl><a href="http://www.ensembl.org/Homo_sapiens/transview?transcript={ensemblTranscriptId}" target="_blank">{ensemblTranscriptId}</a>',
                    },
                    {
                        text: "SO Term(s)",
                        dataIndex: "soTerms",
                        flex: 1.7,
                        renderer: function(value, meta, rec, rowIndex, colIndex, store){

                            if(!_.isUndefined(value)){

                                var tempArray = [];
                                _.each(_.keys(value), function(key){
                                    tempArray.push(this[key].soName);
                                },value);

                                var groupedArr = _.groupBy(tempArray);
                                var so_array = [];
                                _.each(_.keys(groupedArr), function(key){
                                    var index =  _.indexOf(consequenceTypesHierarchy, key);
//                                        so_array.splice(index, 0, key+' ('+this[key].length+')');
//                                        so_array.push(key+' ('+this[key].length+')')
                                    if(index < 0){
                                        so_array.push(key)
                                    }else{
                                        so_array[index] = key;
                                    }
                                },groupedArr);
                                so_array =  _.compact(so_array);
//                              console.log(so_array)
                                    meta.tdAttr = 'data-qtip="'+ so_array.join(',')+'"';
                                return value ? Ext.String.format(
                                    '<tpl>'+so_array.join(',')+'</tpl>',
                                    value
                                ) : '';
                            }else{
                                return '';
                            }

                        }
                    },
                    {
                        text: "Biotype",
                        dataIndex: "biotype",
                        flex: 1.3
                    },
                    {
                        text: "Codon",
                        dataIndex: "codon",
                        flex: 0.6
                    },
                    {
                        text: "cDna <br />Position",
                        dataIndex: "cDnaPosition",
                        flex: 0.6
                    },
                    {
                        text: "AA <br />Change",
                        dataIndex: "aaChange",
                        flex: 0.6
                    }

                ],
                defaults: {
                    align:'left' ,
                    sortable : true
                }
            };



            var store = Ext.create("Ext.data.Store", {
                //storeId: "GenotypeStore",
                pageSize: 20,
                fields: [
                    {name: 'ensemblGeneId', type: 'string'},
                    {name: "geneName", type: "string"},
                    {name: "soTerms", type: "auto"}
                ],
                data: annotData,
                proxy: {
                    type: 'memory',
                    enablePaging: true
                },
                sorters:
                {
                    property: 'id',
                    direction: 'ASC'
                }
            });

            var paging = Ext.create('Ext.PagingToolbar', {
                store: store,
                id: _this.id + "_annotatPagingToolbar",
                pageSize: 20,
                displayInfo: true,
                displayMsg: 'Transcripts {0} - {1} of {2}',
                emptyMsg: "No records to display"
            });


            var grid = Ext.create('Ext.grid.Panel', {
                store: store,
                loadMask: true,
                width: 960,
//            height: 370,
//                maxHeight:550,
                autoHeight: true,
                cls:'genotype-grid',
                margin: 5,
                viewConfig: {
                    emptyText: 'No records to display',
                    enableTextSelection: true,
                    deferEmptyText:false
                },
                columns: annotColumns,
                tbar: paging
            });
        }else{
            var grid = Ext.create('Ext.view.View', {
                tpl: new Ext.XTemplate(['<div style="margin-left:5px;">No Annotation data available</div>'])
            });
        }





        var annotPanel = Ext.create('Ext.panel.Panel', {
//            header:{
//                titlePosition:1
//            },
//            title: 'Annotation',
            border: false,
            layout: {
                type: 'vbox',
                align: 'fit'
            },
            overflowX:true,
            items: [grid]
        });

        if(annotData){
            paging.doRefresh();
        }


        return annotPanel;
    }
};