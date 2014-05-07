function Theme(settings)
{
    for(var i in settings)
    {
        this[i] = settings[i];
    }
}

function Themer()
{
    this.currentTheme;
    this.themes = {}
    
    this.themes['default'] = new Theme({
        defaultGridFill: [function(cell){ return cell.activePath ? 255 : 200; }, function(cell){ return cell.activePath ? 250 : 200; }, 255, function(cell){ return 1 - ((1 / (cell.wrapper.depth)) * cell.level); }],
        defaultTokenFill: [200, 200, 255, 1],
        defaultTokenStroke: [210, 210, 255, 1]
    });

    this.themes['rainbow'] = new Theme({
        defaultGridFill: [function(){ return Math.floor(Math.random()*256); }, function(){ return Math.floor(Math.random()*256); }, function(){ return Math.floor(Math.random()*256); }, function(cell){ return 1 - ((2 / (3 * cell.wrapper.depth)) * cell.level); }],
        defaultTokenFill: [240, 240, 240, .7],
        defaultTokenStroke: [255, 255, 255, .7]
    });
}

Theme.prototype.refreshTheme = function()
{
    this.applyTheme(this.currentTheme, _GRID, _TOKEN);
}

Themer.prototype.applyTheme = function(themeName, grid, token)
{
    if(themeName in this.themes)
    {
        this.currentTheme = this.themes[themeName];
        var t = this.currentTheme;

        //update grid colors
        for(var i = 0; i < grid.cells.length; i++)
        {
            grid.cells[i].fillRed(   $.isFunction(t.defaultGridFill[0]) ? t.defaultGridFill[0](grid.cells[i]) : t.defaultGridFill[0]);
            grid.cells[i].fillGreen( $.isFunction(t.defaultGridFill[1]) ? t.defaultGridFill[1](grid.cells[i]) : t.defaultGridFill[1]);
            grid.cells[i].fillBlue(  $.isFunction(t.defaultGridFill[2]) ? t.defaultGridFill[2](grid.cells[i]) : t.defaultGridFill[2]);
            grid.cells[i].fillAlpha( $.isFunction(t.defaultGridFill[3]) ? t.defaultGridFill[3](grid.cells[i]) : t.defaultGridFill[3]);
        }
        grid.layer.draw();

        //update token colors
        token.k.fillRed(   $.isFunction(t.defaultTokenFill[0]) ? t.defaultTokenFill[0](token) : t.defaultTokenFill[0]);
        token.k.fillGreen( $.isFunction(t.defaultTokenFill[1]) ? t.defaultTokenFill[1](token) : t.defaultTokenFill[1]);
        token.k.fillBlue(  $.isFunction(t.defaultTokenFill[2]) ? t.defaultTokenFill[2](token) : t.defaultTokenFill[2]);
        token.k.fillAlpha( $.isFunction(t.defaultTokenFill[3]) ? t.defaultTokenFill[3](token) : t.defaultTokenFill[3]);
        token.k.strokeRed(   $.isFunction(t.defaultTokenStroke[0]) ? t.defaultTokenStroke[0](token) : t.defaultTokenStroke[0]);
        token.k.strokeGreen( $.isFunction(t.defaultTokenStroke[1]) ? t.defaultTokenStroke[1](token) : t.defaultTokenStroke[1]);
        token.k.strokeBlue(  $.isFunction(t.defaultTokenStroke[2]) ? t.defaultTokenStroke[2](token) : t.defaultTokenStroke[2]);
        token.k.strokeAlpha( $.isFunction(t.defaultTokenStroke[3]) ? t.defaultTokenStroke[3](token) : t.defaultTokenStroke[3]);
        token.layer.draw();
    }
}