const GbaType = {
  Nothing: 0,
  Dagger: 1,
  Bomb: 2,
  Heart: 3,
  Gun: 4,
  Angel: 5
};

const GbaProb = {
  Dagger: (8/25),
  Bomb: (6/25),
  Heart: (5/25),
  Gun: (3/25),
  Angel: (3/25)
};

function shuffle_array(array)
{
    for (let i = array.length - 1; i > 0; i--)
    {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function gba_type_translate(type)
{
    str = "";
    switch(type)
    {
        case GbaType.Dagger:
            str = "🗡️";
            break;
        case GbaType.Bomb:
            str = "💣";
            break;
        case GbaType.Heart:
            str = "❤️";
            break;
        case GbaType.Gun:
            str = "🔫";
            break;
        case GbaType.Angel:
            str = "👼🏼";
            break;
        default:
        case GbaType.Nothing:
            break;
    }
    return str;
}

function e_with_text(name, text)
{
    node = document.createElement(name);
    text_node = document.createTextNode(text);
    node.appendChild(text_node);
    
    return node;
}

function e_input_text()
{
    inp = document.createElement("input")
    
}

class GbaCell
{
    constructor(type, width_px, height_px)
    {
        this.is_hidden = true;
        
        this.cell = document.createElement("div");
        this.cell.style.width = width_px + "px";
        this.cell.style.height = height_px + "px";
        this.cell.style.float = "left";
        this.cell.style.border = "1px solid black";
        this.cell.style.textAlign = "center";
        this.cell.style.lineHeight = height_px + "px";
        this.cell.style.cursor = "pointer"
        this.cell.style.overflow = "hidden"
        this.cell.onclick = this.click_action.bind(this);
        
        this.type = type;
        this.cell.textContent = "?";
    }
    
    click_action()
    {
        if (this.is_hidden)
        {
            this.is_hidden = false;
            this.cell.textContent = gba_type_translate(this.type);
        }
        else
        {
            this.is_hidden = true;
            this.cell.textContent = "?";
        }
    }
    
    render(root_e)
    {
        root_e.appendChild(this.cell)
    }
}

class NumInput
{
    constructor(name, val, label)
    {
        this.input = document.createElement("input");
        this.input.setAttribute("type", "number");
        this.input.setAttribute("name", name);
        this.input.setAttribute("value", val);
    
        this.label = e_with_text("label", label);
        this.label.setAttribute("for", name);
    }
    
    render(root_e)
    {
        root_e.appendChild(this.label)
        root_e.appendChild(this.input)
        root_e.appendChild(document.createElement("br"))
    }
    
    get()
    {
        return this.input.value;
    }
}

class GenBtn
{
    constructor(name, val)
    {
        this.btn = e_with_text("button", val);
        this.btn.setAttribute("type", "button");
        this.btn.setAttribute("name", name);
        this.btn.onclick = this.click_action.bind(this);
    }
    
    set_gba(gba)
    {
        this.gba = gba;
    }
    
    click_action()
    {
        this.gba.store_vals();
        this.gba.generate_fields();
        this.gba.render_table();
    }
    
    render(root_e)
    {
        this.root_e = root_e;
        
        this.root_e.appendChild(this.btn)
        this.root_e.appendChild(document.createElement("br"))
    }
}


class GunsBombsAngels
{
  constructor()
  {
    this.rows = 0;
    this.cols = 0;
    this.cell_dim_px = 24;
    this.prob_guns = 0;
    this.prob_bombs = 0;
    this.prob_angels = 0;
    this.row_headings = new Array();
    this.col_headings = new Array();
    this.table = new Array();
    this.vals = new Array();
    this.state = "constructed";
    this.gba_div = document.createElement("div");
    this.gba_div_out = document.createElement("div");
    this.gba_div.appendChild(this.gba_div_out)
  }
  
  render(root_e)
  {
    root_e.appendChild(this.gba_div);
  }
  
  clear()
  {
    this.gba_div_out.replaceChildren();
  }
  
  render_form()
  {
    let form = document.createElement("form");
    
    this.rows_e = new NumInput("rows", 1, "Rows:")
    this.rows_e.render(form)
    
    this.cols_e = new NumInput("cols", 1, "Cols:")
    this.cols_e.render(form)
    
    this.btn_e = new GenBtn("submit", "Generate!")
    this.btn_e.set_gba(this)
    this.btn_e.render(form)
    
    this.gba_div.appendChild(form)
  }
  
  generate_fields()
  {
    let total = this.rows * this.cols;
    let dagger_num = Math.floor(total * GbaProb.Dagger);
    let heart_num = Math.floor(total * GbaProb.Heart);
    let bomb_num = Math.floor(total * GbaProb.Bomb);
    let angel_num = Math.floor(total * GbaProb.Angel);
    let gun_num = Math.floor(total * GbaProb.Gun);
    
    let none_num = total - (dagger_num + bomb_num + heart_num + angel_num + gun_num)
    
    for (let i = 0; i < dagger_num; i++)
    {
        this.table.push(new GbaCell(GbaType.Dagger,
                                    this.cell_dim_px,
                                    this.cell_dim_px));
    }
    for (let i = 0; i < heart_num; i++)
    {
        this.table.push(new GbaCell(GbaType.Heart,
                                    this.cell_dim_px,
                                    this.cell_dim_px));
    }
    for (let i = 0; i < bomb_num; i++)
    {
        this.table.push(new GbaCell(GbaType.Bomb,
                                    this.cell_dim_px,
                                    this.cell_dim_px));
    }
    for (let i = 0; i < angel_num; i++)
    {
        this.table.push(new GbaCell(GbaType.Angel,
                                    this.cell_dim_px,
                                    this.cell_dim_px));
    }
    for (let i = 0; i < gun_num; i++)
    {
        this.table.push(new GbaCell(GbaType.Gun,
                                    this.cell_dim_px,
                                    this.cell_dim_px));
    }
    for (let i = 0; i < none_num; i++)
    {
        this.table.push(new GbaCell(GbaType.Dagger,
                                    this.cell_dim_px,
                                    this.cell_dim_px));
    }
    
    shuffle_array(this.table);
  }
  
  store_vals()
  {
    this.rows = this.rows_e.get();
    this.cols = this.cols_e.get();
    
  }
  
  generate_types()
  {
    
  }
  
  render_table()
  {
    this.clear();
    let x_px = this.cols * this.cell_dim_px;
    let y_px = this.rows * this.cell_dim_px;
    
    
    let frme = document.createElement("div");
    frme.style.width = (x_px + this.cell_dim_px + (this.cols*2 + 2)) + "px";
    frme.style.height = (y_px + this.cell_dim_px + (this.rows*2 + 2)) + "px";
    frme.style.clear = "both";
    
    let field = document.createElement("div");
    field.style.width = (x_px + (this.cols*2)) + "px";
    field.style.height = (y_px + (this.rows*2)) + "px";
    field.style.float = "left";
    field.style.overflow = "hidden";
    // field.style.border = "1px solid black";
    
    
    let x_axis = document.createElement("div");
    x_axis.style.width = (x_px + (this.cols*2)) + "px";
    x_axis.style.height = this.cell_dim_px + "px";
    x_axis.style.marginLeft = this.cell_dim_px + "px";
    
    for (let i = 0; i < this.cols; i++)
    {
        let el = document.createElement("div");
        el.style.width = this.cell_dim_px + "px";
        el.style.height = this.cell_dim_px + "px";
        el.style.float = "left";
        el.style.textAlign = "center";
        el.style.lineHeight = this.cell_dim_px + "px";
        el.style.borderBottom = "1px solid black";
        el.style.borderLeft = "1px solid black";
        el.style.borderRight = "1px solid black";
        el.style.fontWeight = "bold";
        el.style.overflow = "hidden"
        el.textContent = String.fromCharCode(65 + i);
        x_axis.appendChild(el);
    }
    
    let y_axis = document.createElement("div");
    y_axis.style.width = (this.cell_dim_px) + "px";
    y_axis.style.height = (y_px + (this.rows*2)) + "px";
    y_axis.style.float = "left";
    
    for (let i = 0; i < this.rows; i++)
    {
        let el = document.createElement("div");
        el.style.width = this.cell_dim_px + "px";
        el.style.height = this.cell_dim_px + "px";
        el.style.borderBottom = "1px solid black";
        el.style.borderTop = "1px solid black";
        el.style.borderRight = "1px solid black";
        el.style.fontWeight = "bold";
        el.style.textAlign = "center";
        el.style.overflow = "hidden"
        el.style.lineHeight = this.cell_dim_px + "px";
        el.textContent = "" + (i+1);
        y_axis.appendChild(el);
    }
    
    let total = this.cols * this.rows
    for (let i = 0; i < total; i++)
    {
        this.table[i].render(field);
    }
    
    frme.appendChild(x_axis)
    frme.appendChild(y_axis)
    frme.appendChild(field)
    
    this.gba_div_out.appendChild(frme);
  }
}



document.title = "Guns, Bombs & Angels!";
let gba = new GunsBombsAngels();


const title_h1 = e_with_text("h1", document.title);
document.body.appendChild(title_h1)

gba.render(document.body)
gba.render_form()
