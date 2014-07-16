function Theme(settings)
{
    for(var i in settings)
    {
        this[i] = settings[i];
    }
}

function Themer()
{
    this.themes = {}

    this.currentTheme;
    this.currentColor = [];
    this.currentInterval;
    
    this.themes['default'] = new Theme({
        name: "default",
        defaultGridFill: [200, 200, 255, function(cell){ return 1 - ((1 / (cell.wrapper.depth)) * cell.level); }],
        defaultTokenFill: [200, 200, 255, 1],
        defaultTokenStroke: [210, 210, 255, 1]
    });


    this.themes['crimson'] = new Theme({
        name: "crimson",
        defaultGridFill: [255, 100, 100, function(cell){ return 1 - ((1 / (cell.wrapper.depth)) * cell.level); }],
        defaultTokenFill: [255, 150, 150, 1],
        defaultTokenStroke: [255, 210, 210, 1]
    });

    this.themes['forest'] = new Theme({
        name: "forest",
        defaultGridFill: [100, 255, 100, function(cell){ return 1 - ((1 / (cell.wrapper.depth)) * cell.level); }],
        defaultTokenFill: [150, 255, 150, 1],
        defaultTokenStroke: [210, 255, 210, 1]
    });

    this.themes['bone'] = new Theme({
        name: "bone",
        defaultGridFill: [200, 200, 200, function(cell){ return 1 - ((1 / (cell.wrapper.depth)) * cell.level); }],
        defaultTokenFill: [245, 245, 245, 1],
        defaultTokenStroke: [210, 210, 210, 1]
    });

    this.themes['random_rainbow'] = new Theme({
        name: "random_rainbow",
        swatches: [[255,255,84],[200,230,76],[140,212,70],[77,199,66],[69,210,176],[70,172,211],[67,140,203],[66,98,199],[82,64,195],[140,63,192],[209,69,193],[230,76,141],[255,84,84],[255,128,84],[255,160,84],[255,181,84]],
        defaultGridFill: [this.randomSwatch.bind(this), this.randomSwatch.bind(this), this.randomSwatch.bind(this), function(cell){ return 1 - ((1 / (3 * (cell.wrapper.depth))) * cell.level); }],
        defaultTokenFill: [240, 240, 240, .8],
        defaultTokenStroke: [255, 255, 255, .8]
    });

    this.themes['radial_rainbow'] = new Theme({
        name: "radial_rainbow",
        swatches: [[255,255,84],[200,230,76],[140,212,70],[77,199,66],[69,210,176],[70,172,211],[67,140,203],[66,98,199],[82,64,195],[140,63,192],[209,69,193],[230,76,141],[255,84,84],[255,128,84],[255,160,84],[255,181,84]],
        defaultGridFill: [this.leveledSwatch.bind(this), this.leveledSwatch.bind(this), this.leveledSwatch.bind(this), 1],
        defaultTokenFill: [240, 240, 240, .8],
        defaultTokenStroke: [255, 255, 255, .8]
    });
}

Themer.prototype.randomSwatch = function()
{
    if(this.currentColor.length == 0) this.currentColor = this.currentTheme.swatches[Math.floor(Math.random() * this.currentTheme.swatches.length)].slice(0);
    return this.currentColor.shift();
}

Themer.prototype.leveledSwatch = function()
{
    if(this.currentColor.length == 0) this.currentColor = this.currentTheme.swatches[arguments[0].level].slice(0);
    return this.currentColor.shift();
}

Themer.prototype.refreshTheme = function()
{
    this.applyTheme(this.currentTheme.name);
}

Themer.prototype.applyTheme = function(themeName)
{
    if(themeName in this.themes)
    {
        this.currentTheme = this.themes[themeName];
        var t = this.currentTheme;

        //update grid colors
        for(var i = 0; i < this.grid.cells.length; i++)
        {
            this.grid.cells[i].fillRed(   $.isFunction(t.defaultGridFill[0]) ? t.defaultGridFill[0](this.grid.cells[i]) : t.defaultGridFill[0]);
            this.grid.cells[i].fillGreen( $.isFunction(t.defaultGridFill[1]) ? t.defaultGridFill[1](this.grid.cells[i]) : t.defaultGridFill[1]);
            this.grid.cells[i].fillBlue(  $.isFunction(t.defaultGridFill[2]) ? t.defaultGridFill[2](this.grid.cells[i]) : t.defaultGridFill[2]);
            this.grid.cells[i].fillAlpha( $.isFunction(t.defaultGridFill[3]) ? t.defaultGridFill[3](this.grid.cells[i]) : t.defaultGridFill[3]);
        }

        //update token colors
        this.grid.currToken.k.fillRed(   $.isFunction(t.defaultTokenFill[0]) ? t.defaultTokenFill[0](this.grid.currToken) : t.defaultTokenFill[0]);
        this.grid.currToken.k.fillGreen( $.isFunction(t.defaultTokenFill[1]) ? t.defaultTokenFill[1](this.grid.currToken) : t.defaultTokenFill[1]);
        this.grid.currToken.k.fillBlue(  $.isFunction(t.defaultTokenFill[2]) ? t.defaultTokenFill[2](this.grid.currToken) : t.defaultTokenFill[2]);
        this.grid.currToken.k.fillAlpha( $.isFunction(t.defaultTokenFill[3]) ? t.defaultTokenFill[3](this.grid.currToken) : t.defaultTokenFill[3]);
        this.grid.currToken.k.strokeRed(   $.isFunction(t.defaultTokenStroke[0]) ? t.defaultTokenStroke[0](this.grid.currToken) : t.defaultTokenStroke[0]);
        this.grid.currToken.k.strokeGreen( $.isFunction(t.defaultTokenStroke[1]) ? t.defaultTokenStroke[1](this.grid.currToken) : t.defaultTokenStroke[1]);
        this.grid.currToken.k.strokeBlue(  $.isFunction(t.defaultTokenStroke[2]) ? t.defaultTokenStroke[2](this.grid.currToken) : t.defaultTokenStroke[2]);
        this.grid.currToken.k.strokeAlpha( $.isFunction(t.defaultTokenStroke[3]) ? t.defaultTokenStroke[3](this.grid.currToken) : t.defaultTokenStroke[3]);

        for(var i = 0; i < this.grid.tokens.length; i++)
        {
            this.grid.tokens[i].k.fillRed(   $.isFunction(t.defaultTokenFill[0]) ? t.defaultTokenFill[0](this.grid.tokens[i]) : t.defaultTokenFill[0]);
            this.grid.tokens[i].k.fillGreen( $.isFunction(t.defaultTokenFill[1]) ? t.defaultTokenFill[1](this.grid.tokens[i]) : t.defaultTokenFill[1]);
            this.grid.tokens[i].k.fillBlue(  $.isFunction(t.defaultTokenFill[2]) ? t.defaultTokenFill[2](this.grid.tokens[i]) : t.defaultTokenFill[2]);
            this.grid.tokens[i].k.fillAlpha( $.isFunction(t.defaultTokenFill[3]) ? t.defaultTokenFill[3](this.grid.tokens[i]) : t.defaultTokenFill[3]);
            this.grid.tokens[i].k.strokeRed(   $.isFunction(t.defaultTokenStroke[0]) ? t.defaultTokenStroke[0](this.grid.tokens[i]) : t.defaultTokenStroke[0]);
            this.grid.tokens[i].k.strokeGreen( $.isFunction(t.defaultTokenStroke[1]) ? t.defaultTokenStroke[1](this.grid.tokens[i]) : t.defaultTokenStroke[1]);
            this.grid.tokens[i].k.strokeBlue(  $.isFunction(t.defaultTokenStroke[2]) ? t.defaultTokenStroke[2](this.grid.tokens[i]) : t.defaultTokenStroke[2]);
            this.grid.tokens[i].k.strokeAlpha( $.isFunction(t.defaultTokenStroke[3]) ? t.defaultTokenStroke[3](this.grid.tokens[i]) : t.defaultTokenStroke[3]);
        }

        this.grid.layer.draw();
    }
}