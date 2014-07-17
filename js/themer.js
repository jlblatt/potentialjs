function Theme(settings)
{
    for(var i in settings)
    {
        this[i] = settings[i];
    }
}

function Themer(themeName)
{
    this.themes = {}

    this.currentTheme;
    this.currentColor = [];
    this.currentInterval;

    this.flashInt;
    this.flashCount = 0;

    var standardElementalTokenFills = {
        fire: [222, 145, 137, 1],
        water: [119, 158, 187, 1],
        air: [214, 199, 132, 1],
        earth: [138, 184, 171, 1],
        light: [209, 209, 209, 1],
        dark: [109, 79, 129, 1]
    };
    
    this.themes['default'] = new Theme({
        name: "default",
        defaultGridFill: [200, 200, 255, function(cell){ return .8 - ((.8 / (cell.wrapper.depth)) * cell.level); }],
        defaultTokenFill: [200, 200, 255, 1],
        elementalTokenFills: standardElementalTokenFills
    });


    this.themes['crimson'] = new Theme({
        name: "crimson",
        defaultGridFill: [255, 100, 100, function(cell){ return .8 - ((.8 / (cell.wrapper.depth)) * cell.level); }],
        defaultTokenFill: [255, 150, 150, 1],
        elementalTokenFills: standardElementalTokenFills
    });

    this.themes['forest'] = new Theme({
        name: "forest",
        defaultGridFill: [100, 255, 100, function(cell){ return .8 - ((.8 / (cell.wrapper.depth)) * cell.level); }],
        defaultTokenFill: [150, 255, 150, 1],
        elementalTokenFills: standardElementalTokenFills
    });

    this.themes['bone'] = new Theme({
        name: "bone",
        defaultGridFill: [200, 200, 200, function(cell){ return .8 - ((.8 / (cell.wrapper.depth)) * cell.level); }],
        defaultTokenFill: [245, 245, 245, 1],
        elementalTokenFills: standardElementalTokenFills
    });

    this.themes['random_rainbow'] = new Theme({
        name: "random_rainbow",
        swatches: [[255,255,84],[200,230,76],[140,212,70],[77,199,66],[69,210,176],[70,172,211],[67,140,203],[66,98,199],[82,64,195],[140,63,192],[209,69,193],[230,76,141],[255,84,84],[255,128,84],[255,160,84],[255,181,84]],
        defaultGridFill: [this.randomSwatch.bind(this), this.randomSwatch.bind(this), this.randomSwatch.bind(this), function(cell){ return 1 - ((1 / (3 * (cell.wrapper.depth))) * cell.level); }],
        defaultTokenFill: [240, 240, 240, .8],
        elementalTokenFills: standardElementalTokenFills
    });

    this.themes['radial_rainbow'] = new Theme({
        name: "radial_rainbow",
        swatches: [[255,255,84],[200,230,76],[140,212,70],[77,199,66],[69,210,176],[70,172,211],[67,140,203],[66,98,199],[82,64,195],[140,63,192],[209,69,193],[230,76,141],[255,84,84],[255,128,84],[255,160,84],[255,181,84]],
        defaultGridFill: [this.leveledSwatch.bind(this), this.leveledSwatch.bind(this), this.leveledSwatch.bind(this), 1],
        defaultTokenFill: [240, 240, 240, .8],
        elementalTokenFills: standardElementalTokenFills
    });

    this.currentTheme = this.themes[themeName];
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


Themer.prototype.refreshToken = function()
{
    var t = this.currentTheme;
    var k = this.grid.currToken.k;

    if(this.grid.currToken.element)
    {
        var ele = this.grid.currToken.element;
        k.fillRed(t.elementalTokenFills[ele][0]);
        k.fillGreen(t.elementalTokenFills[ele][1]);
        k.fillBlue(t.elementalTokenFills[ele][2]);
        k.fillAlpha(t.elementalTokenFills[ele][3]);
    }
    else if(!this.flashInt)
    {
        var themerInstance = this;
        this.flashInt = setInterval(function() {
            themerInstance.grid.currToken.k.fillRed(themerInstance.currentTheme.elementalTokenFills[_ELEMENTS[themerInstance.flashCount]][0]);
            themerInstance.grid.currToken.k.fillGreen(themerInstance.currentTheme.elementalTokenFills[_ELEMENTS[themerInstance.flashCount]][1]);
            themerInstance.grid.currToken.k.fillBlue(themerInstance.currentTheme.elementalTokenFills[_ELEMENTS[themerInstance.flashCount]][2]);
            themerInstance.grid.currToken.k.fillAlpha(themerInstance.currentTheme.elementalTokenFills[_ELEMENTS[themerInstance.flashCount]][3]);
            themerInstance.flashCount++;
            if(themerInstance.flashCount > _ELEMENTS.length - 2) themerInstance.flashCount = 0;
            themerInstance.refreshToken();
        }, 100);
    }

    this.grid.layer.draw();
}

Themer.prototype.stopTokenFlashing = function()
{
    if(this.flashInt)
    {
        clearInterval(this.flashInt);
        this.flashInt = undefined;
        this.flastCount = 0;

        var k = this.grid.currToken.k;
        k.fillRed(this.currentTheme.defaultTokenFill[0]);
        k.fillGreen(this.currentTheme.defaultTokenFill[1]);
        k.fillBlue(this.currentTheme.defaultTokenFill[2]);
        k.fillAlpha(this.currentTheme.defaultTokenFill[3]);
    }
}

Themer.prototype.refreshTheme = function()
{
    this.applyTheme(this.currentTheme.name);
}

Themer.prototype.applyTheme = function(themeName)
{
    if(themeName in this.themes && this.grid)
    {
        this.currentTheme = this.themes[themeName];
        var t = this.currentTheme;

        //update grid colors
        for(var i = 0; i < this.grid.cells.length; i++)
        {
            var c = this.grid.cells[i];

            c.fillRed(   $.isFunction(t.defaultGridFill[0]) ? t.defaultGridFill[0](c) : t.defaultGridFill[0]);
            c.fillGreen( $.isFunction(t.defaultGridFill[1]) ? t.defaultGridFill[1](c) : t.defaultGridFill[1]);
            c.fillBlue(  $.isFunction(t.defaultGridFill[2]) ? t.defaultGridFill[2](c) : t.defaultGridFill[2]);
            c.fillAlpha( $.isFunction(t.defaultGridFill[3]) ? t.defaultGridFill[3](c) : t.defaultGridFill[3]);

            //check for a token on this cell and color that too
            if(c.holding)
            {
                if(c.heldToken.element)
                { 
                    var ele = c.heldToken.element;
                    c.heldToken.k.fillRed(   $.isFunction(t.elementalTokenFills[ele][0]) ? t.elementalTokenFills[ele][0](c.heldToken) : t.elementalTokenFills[ele][0]);
                    c.heldToken.k.fillGreen( $.isFunction(t.elementalTokenFills[ele][1]) ? t.elementalTokenFills[ele][1](c.heldToken) : t.elementalTokenFills[ele][1]);
                    c.heldToken.k.fillBlue(  $.isFunction(t.elementalTokenFills[ele][2]) ? t.elementalTokenFills[ele][2](c.heldToken) : t.elementalTokenFills[ele][2]);
                    c.heldToken.k.fillAlpha( $.isFunction(t.elementalTokenFills[ele][3]) ? t.elementalTokenFills[ele][3](c.heldToken) : t.elementalTokenFills[ele][3]);
                }
                else
                {
                    c.heldToken.k.fillRed(   $.isFunction(t.defaultTokenFill[0]) ? t.defaultTokenFill[0](c.heldToken) : t.defaultTokenFill[0]);
                    c.heldToken.k.fillGreen( $.isFunction(t.defaultTokenFill[1]) ? t.defaultTokenFill[1](c.heldToken) : t.defaultTokenFill[1]);
                    c.heldToken.k.fillBlue(  $.isFunction(t.defaultTokenFill[2]) ? t.defaultTokenFill[2](c.heldToken) : t.defaultTokenFill[2]);
                    c.heldToken.k.fillAlpha( $.isFunction(t.defaultTokenFill[3]) ? t.defaultTokenFill[3](c.heldToken) : t.defaultTokenFill[3]);
                }
            }
        }

        //update token colors
        var k = this.grid.currToken.k;
        if(this.grid.currToken.element)
        {
            var ele = this.grid.currToken.element;
            k.fillRed(   $.isFunction(t.elementalTokenFills[ele][0]) ? t.elementalTokenFills[ele][0](this.grid.currToken) : t.elementalTokenFills[ele][0]);
            k.fillGreen( $.isFunction(t.elementalTokenFills[ele][1]) ? t.elementalTokenFills[ele][1](this.grid.currToken) : t.elementalTokenFills[ele][1]);
            k.fillBlue(  $.isFunction(t.elementalTokenFills[ele][2]) ? t.elementalTokenFills[ele][2](this.grid.currToken) : t.elementalTokenFills[ele][2]);
            k.fillAlpha( $.isFunction(t.elementalTokenFills[ele][3]) ? t.elementalTokenFills[ele][3](this.grid.currToken) : t.elementalTokenFills[ele][3]);
        }
        else
        {
            k.fillRed(   $.isFunction(t.defaultTokenFill[0]) ? t.defaultTokenFill[0](this.grid.currToken) : t.defaultTokenFill[0]);
            k.fillGreen( $.isFunction(t.defaultTokenFill[1]) ? t.defaultTokenFill[1](this.grid.currToken) : t.defaultTokenFill[1]);
            k.fillBlue(  $.isFunction(t.defaultTokenFill[2]) ? t.defaultTokenFill[2](this.grid.currToken) : t.defaultTokenFill[2]);
            k.fillAlpha( $.isFunction(t.defaultTokenFill[3]) ? t.defaultTokenFill[3](this.grid.currToken) : t.defaultTokenFill[3]);
        }

        this.grid.layer.draw();
    }
}