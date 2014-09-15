/*
 * Copyright (c) 2014 Francisco Salavert (SGL-CIPF)
 * Copyright (c) 2014 Alejandro Alemán (SGL-CIPF)
 * Copyright (c) 2014 Ignacio Medina (EBI-EMBL)
 *
 * This file is part of JSorolla.
 *
 * JSorolla is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * JSorolla is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with JSorolla. If not, see <http://www.gnu.org/licenses/>.
 */
function EvaStudyBrowserPanel(args) {
    _.extend(this, Backbone.Events);
    this.id = Utils.genId("EvaStudyBrowserPanel");

    this.target;
    this.title = "Study Browser";
    this.height = 800;
    this.autoRender = true;
//    this.studies = [];
//    this.studiesStore;
    this.border = false;
    this.speciesList = [
        {
            assembly: "GRCh37.p7",
            common: "human",
            id: "extModel256-1",
            sciAsembly: "Homo sapiens (GRCh37.p7)",
            scientific: "Homo sapiens",
            species: "hsa"
        }
    ];

    this.studiesStore = Ext.create('Ext.data.Store', {
        pageSize: 20,
        proxy: {
            type: 'memory'
        },
        fields: [
            {name: 'id', type: 'string'},
            {name: 'name', type: 'string'}
        ],
        autoLoad: false
    });

    _.extend(this, args);

    this.on(this.handlers);

    this.rendered = false;

    if (this.autoRender) {
        this.render();
    }

    this.load();
}

EvaStudyBrowserPanel.prototype = {
    render: function () {
        if(!this.rendered) {
            this.div = document.createElement('div');
            this.div.setAttribute('id', this.id);
            this.panel = this._createPanel();
            this.rendered = true;
        }
    },

    draw: function () {
        if(!this.rendered) {
            this.render();
        }
        // Checking whether 'this.target' is a HTMLElement or a string.
        // A DIV Element is needed to append others HTML Elements
        this.targetDiv = (this.target instanceof HTMLElement) ? this.target : document.querySelector('#' + this.target);
        if (!this.targetDiv) {
            console.log('EVAStudyBrowserPanel: target ' + this.target + ' not found');
            return;
        }
        this.targetDiv.appendChild(this.div);

        this.panel.render(this.div);
    },

    load: function (values) {
        var _this = this;
        if(!values){
            if(_this.formPanel){
                values = _this.formPanel.getValues();
                console.log(values)
            }
        }

        for (key in values) {
            if (values[key] == '') {
                delete values[key]
            }
        }

//        this.studiesStore.clearFilter();

        EvaManager.get({
            host: 'http://wwwdev.ebi.ac.uk/eva/webservices/rest',
            category: 'meta/studies',
            resource: 'all',
            params: values,
            success: function (response) {
                var studies = [];
                try {
                    studies = response.response[0].result;
                } catch (e) {
                    console.log(e);
                }
                _this.studiesStore.loadRawData(studies);
            }
        });


    },
    _createPanel: function () {
        var _this = this;
        var stores = {
            species: Ext.create('Ext.data.Store', {
                autoLoad: true,
                fields: ['display', 'count'],
                data: []
            }),
            type: Ext.create('Ext.data.Store', {
                autoLoad: true,
                fields: ['display', 'count'],
                data: []
            }),
            scope: Ext.create('Ext.data.Store', {
                autoLoad: true,
                fields: ['display', 'count'],
                data: []
            }),
            material: Ext.create('Ext.data.Store', {
                autoLoad: true,
                fields: ['display', 'count'],
                data: []
            })
        };

        var assemblyStore = Ext.create('Ext.data.Store', {
            autoLoad: true,
            fields: ['text', 'value'],
            data: [
                {display: '37', value: '37'}
            ]
        });

        var platformStore = Ext.create('Ext.data.Store', {
            autoLoad: true,
            fields: ['text', 'value'],
            data: [
                {display: 'Illumina', value: 'ngs'},
                {display: 'Roche', value: 'array'},
                {display: 'ABI', value: 'array'}
            ]
        });

        var scopeStore = Ext.create('Ext.data.Store', {
            autoLoad: true,
            fields: ['text', 'value'],
            data: [
                {display: 'Single Isolate', value: 'single-isolate'},
                {display: 'Multi Isolate', value: 'multi-isolate'}
            ]
        });



        var speciesFieldTag = Ext.create('Ext.form.field.Tag', {
            fieldLabel: 'Organisms',
//            labelWidth: this.labelWidth,
            labelAlign: 'top',
            store: stores.species,
            queryMode: 'local',
            displayField: 'display',
            valueField: 'display',
            publishes: 'value',
            name: 'species',
            listeners: {
                change: function () {
                    _this.load()
                }
            }
        });

        var assemblyFieldTag = Ext.create('Ext.form.field.Tag', {
            fieldLabel: 'Assembly',
//            labelWidth: this.labelWidth,
            labelAlign: 'top',
            store: assemblyStore,
            queryMode: 'local',
            displayField: 'display',
            valueField: 'value',
            publishes: 'value',
            name: 'assembly',
            listeners: {
                change: function () {
                    _this.load()
                }
            }
        });


        var typeFieldTag = Ext.create('Ext.form.field.Tag', {
            fieldLabel: 'Type',
//            labelWidth: this.labelWidth,
            labelAlign: 'top',
            store: stores.type,
            queryMode: 'local',
            displayField: 'display',
            valueField: 'display',
            publishes: 'value',
            name: 'type',
            listeners: {
                change: function () {
                    _this.load()
                }
            }
        });

        var platformFieldTag = Ext.create('Ext.form.field.Tag', {
            fieldLabel: 'Platform',
//            labelWidth: this.labelWidth,
            labelAlign: 'top',
            store: platformStore,
            queryMode: 'local',
            displayField: 'display',
            valueField: 'value',
            publishes: 'value',
            name: 'method',
            listeners: {
                change: function () {
                    _this.load()
                }
            }

        });


        var scopeFieldTag = Ext.create('Ext.form.field.Tag', {
            fieldLabel: 'Scope',
//            labelWidth: this.labelWidth,
            labelAlign: 'top',
            store: scopeStore,
            queryMode: 'local',
            displayField: 'display',
            valueField: 'value',
            publishes: 'value',
            name: 'scope',
            listeners: {
                change: function () {
                    _this.load()
                }
            }

        });

        var studySearchField = Ext.create('Ext.form.field.Text', {
            fieldLabel: 'Search',
            labelAlign: 'top',
            emptyText: 'search',
            name: 'search',
            listeners: {
                change: function () {
                    var value = this.getValue();
                    if (value == "") {
                        _this.studiesStore.clearFilter();
                    } else {
                        var regex = new RegExp(value, "i");
                        _this.studiesStore.filterBy(function (e) {
                            return regex.test(e.get('name')) || regex.test(e.get('description'));
                        });
                    }
                }
            }

        });

        this.columns =[
            {
                text: "ID",
                dataIndex: 'id',
                flex: 2,
                // To render a link to FTP
                renderer: function (value, meta, rec, rowIndex, colIndex, store) {
                    meta.tdAttr = 'data-qtip="Click to see  more detailed information"';
                    return value ? Ext.String.format(
                        '<a href="?eva-study='+value+'" target="_blank">'+value+'</a>',
                        value
                    ) : '';
                }
            },
            {
                text: "Name",
                dataIndex: 'name',
                flex: 7
            },
            {
                text: "Organism",
                dataIndex: 'speciesScientificName',
                flex: 3,
                renderer: function(value, p, record) {
                    return value ? Ext.String.format(
                        '<div data-toggle="popover" title="Organism" data-content="And her...">{0}</div>',
                        value
                    ) : '';
                }
            },
            {
                text: "Type",
                dataIndex: 'type',
                flex: 3
            },
//                            {
//                                text: "Scope",
//                                dataIndex: 'scope',
//                                flex: 3
//                            },
            {
                text: "Number of Variants",
                dataIndex: 'numVariants',
                flex: 3
            },
            {
                text: "Download",
//                        xtype: 'checkcolumn',
                dataIndex: 'id',
                flex: 3,
                renderer: function (value, p, record) {
                    return value ? Ext.String.format(
                        '<a href="ftp://ftp.ebi.ac.uk/pub/databases/eva/{0}" target="_blank">FTP Download</a>',
                        value,
                        record.data.threadid
                    ) : '';
                }
            }

        ];


        this.grid = Ext.create('Ext.grid.Panel', {
                title: 'Studies found',
                store: this.studiesStore,
                header: this.headerConfig,
                loadMask: true,
//                hideHeaders: true,
//                plugins: 'bufferedrenderer',
                plugins: [{
                    ptype: 'rowexpander',
                    rowBodyTpl : new Ext.XTemplate(
                        '<p style="padding: 2px 2px 2px 15px"><b>Platform:</b> {platform}</p>',
                        '<p style="padding: 2px 2px 2px 15px"><b>Centre:</b> {center}</p>',
                        '<p style="padding: 2px 2px 5px 15px"><b>Description:</b> {description}</p>'
                    )
                }],
                height: 420,
                features: [
                    {ftype: 'summary'}
                ],
                viewConfig: {
                    emptyText: 'No studies found',
                    enableTextSelection: true,
                    markDirty: false,
                    listeners: {
                        itemclick: function (este, record) {

                        },
                        itemcontextmenu: function (este, record, item, index, e) {

                        }
                    }
                },
                selModel: {
                    listeners: {
                        'selectionchange': function (sm, selectedRecord) {
                            if (selectedRecord.length) {
                                var row = selectedRecord[0].data;
                                _this.trigger("study:select", {sender: _this, args: row});
                            }
                        }
                    }
                },
                columns: this.columns
            }
        );


        var submitButton = Ext.create('Ext.button.Button', {
            text: 'Submit',
            handler: function (btn) {
                console.log(">>>>>>>>>"+panel);
                var values = panel.getValues();
                _this.load(values);
            }
        });


        this.leftPanel = Ext.create('Ext.container.Container', {
            flex: 1,
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            defaults: {
                margin: 5
            },
            items: [
//                submitButton,
                studySearchField,
                speciesFieldTag,
//                this.assemblyFieldTag,
                typeFieldTag,
                platformFieldTag
            ]
        });


        this.rightPanel = Ext.create('Ext.container.Container', {
            flex: 5,
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            defaults: {
                margin: 5
            },
            items: [this.grid]
        });

        this.formPanel = Ext.create('Ext.form.Panel', {
            title: 'Short Genetic Variations',
            border: this.border,
            header: this.headerConfig,
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            defaults: {
                margin: 5
            },
            items: [
                this.leftPanel,
                this.rightPanel
            ]
        });


        EvaManager.get({
            host: 'http://wwwdev.ebi.ac.uk/eva/webservices/rest',
            category: 'meta/studies',
            resource: 'stats',
            params: {},
            success: function (response) {
                try {
                    var statsData = {};
                    var responseStatsData = response.response[0].result[0];
                    for (key in responseStatsData) {
                        var stat = responseStatsData[key];
                        var arr = [];
                        for (key2 in stat) {
                            var obj = {};
                            // TODO We must take care of the types returned
                            if(key2.indexOf(',') == -1) {
                                obj['display'] = key2;
                            }
//                                obj['display'] = key2;
                            obj['count'] = stat[key2];
                            arr.push(obj);
                        }
                        statsData[key] = arr;
                        if (typeof stores[key] !== 'undefined') {
                            stores[key].loadRawData(statsData[key]);
                        }

                    }
                } catch (e) {
                    console.log(e);
                }
            }
        });
        return  this.formPanel;
    },

    setLoading: function (loading) {
        this.panel.setLoading(loading);
    },

    update: function () {
        if (this.panel) {
            this.panel.update();
        }
    }

};