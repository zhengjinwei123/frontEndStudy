requirejs.config({
    baseUrl: '/javascripts',
    
    map: {
        '*': {
        }
    },
    paths: {
        app:                'app',
        model:              'model',
        view:               'view',
        template:           '../template',
        jquery:             [ 'jquery-1.11.0.min' ],
        underscore:         [ 'underscore.min' ],
        async:              [ 'async' ],
        bootstrap:          [ 'bootstrap.min' ],
        jgrowl:             [ 'jquery.jgrowl.min' ],
        showLoading:        [ 'jquery.showLoading.min' ],
        jform:              [ 'jquery.form' ],
        datePicker:         [ 'My97DatePicker/WdatePicker' ],
        highcharts:         [ 'highcharts' ],
        ztree:              [ 'jquery.ztree.all.min' ],
        bootstrapSelect:    [ 'bootstrap-select/js/bootstrap-select.min' ],
        cloneya:            [ 'jquery-cloneya.min' ]
    },
    shim: {
        'underscore':       {exports: '_'},
        'bootstrap':        {deps: ['jquery']},
        'jgrowl':           {deps: ['jquery']},
        'showLoading':      {deps: ['jquery']},
        'jform':            {deps: ['jquery']},
        'highcharts':       {deps: ['jquery']},
        'bootstrapSelect':  {deps: ['jquery','bootstrap']},
        'cloneya':          {deps: ['jquery']},
        'ztree':            {deps: ['jquery']}
    }
});