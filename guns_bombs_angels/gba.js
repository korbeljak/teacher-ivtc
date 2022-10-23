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
    constructor(val, x, y)
    {
        this.x = x;
        this.y = y;
        this.val = val;
        this.is_hidden = true;
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
}

class SubmitInput
{
    constructor(name, val)
    {
        this.input = document.createElement("input");
        this.input.setAttribute("type", "submit");
        this.input.setAttribute("name", name);
        this.input.setAttribute("value", val);
    }
    
    render(root_e)
    {
        root_e.appendChild(this.input)
        root_e.appendChild(document.createElement("br"))
    }
}


class GunsBombsAngels
{
  constructor()
  {
    this.rows = 0;
    this.cols = 0;
    this.prob_guns = 0;
    this.prob_bombs = 0;
    this.prob_angels = 0;
    this.row_headings = new Array();
    this.col_headings = new Array();
    this.state = "constructed";
  }
  
  render_form()
  {
    let form = document.createElement("form");
    
    let rows = new NumInput("rows", 1, "Rows:")
    rows.render(form)
    
    let cols = new NumInput("cols", 1, "Cols:")
    cols.render(form)
    
    let submit = new SubmitInput("submit", "Generate!")
    submit.render(form)
    
    // prob_guns = document.createElement("input");
    // prob_bombs = document.createElement("input");
    // prob_angels = document.createElement("input");
    
    return form;
  }
  
  generate_fields()
  {
    
  }
  
  render_table()
  {
    
  }
  
  click(x, y)
  {
    
  }
}



document.title = "Guns, Bombs & Angels!";
let gba = new GunsBombsAngels();
let form = gba.render_form();

const title_h1 = e_with_text("h1", document.title);
document.body.appendChild(title_h1)
document.body.appendChild(form)