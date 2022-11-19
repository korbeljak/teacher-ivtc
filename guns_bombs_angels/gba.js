const GbaType = {
  Nothing: 0,
  Dagger: 1,
  Bomb: 2,
  Heart: 3,
  Gun: 4,
  Angel: 5
};

const GbaTeamState = {
  Inactive: 0,
  Active: 1,
  Target: 2,
  Dead: 3
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
    constructor(gba, type, width_px, height_px)
    {
        this.is_hidden = true;
        this.gba = gba;
        
        this.cell = document.createElement("div");
        this.cell.style.width = width_px + "px";
        this.cell.style.height = height_px + "px";
        this.cell.className = "gba_cell";
        this.cell.style.lineHeight = height_px + "px";
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
        
        this.gba.game_step(this.type)
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
        this.gba.launch_game();
    }
    
    render(root_e)
    {
        this.root_e = root_e;
        
        this.root_e.appendChild(this.btn)
        this.root_e.appendChild(document.createElement("br"))
    }
}

class GbaTeam
{
    constructor(lives, id)
    {
        this.lives = lives;
        this.name = "Team "+id;
        this.id = id
        this.state = GbaTeamState.Inactive;
        
        this.team_box = document.createElement("div");
        this.team_box.className = "team_box tb_inactive"
        
        this.team_box_name = document.createElement("div");
        this.team_box_name.className = "team_box_name"
        this.team_box_name.textContent = this.name
        
        this.team_box_lives = document.createElement("div");
        this.team_box_lives.className = "team_box_lives"
        this.team_box_lives.textContent = ""+lives;
        
        this.team_box.appendChild(this.team_box_name);
        this.team_box.appendChild(this.team_box_lives);
    }
    
    get_team_box()
    {
        return this.team_box
    }
    
    activate()
    {
        if (this.state == GbaTeamState.Dead)
        {
            return;
        }
        
        this.state = GbaTeamState.Active;
        this.draw();
    }
    
    deactivate()
    {
        if (this.state == GbaTeamState.Dead)
        {
            return;
        }
        
        this.state = GbaTeamState.Inactive;
        this.draw();
    }
    
    target()
    {
        if (this.state == GbaTeamState.Dead)
        {
            return;
        }
        
        this.state = GbaTeamState.Target;
        this.draw();
    }
    
    draw()
    {
        this.team_box_lives.textContent = ""+this.lives
        let str = "team_box ";
        switch(this.state)
        {
            case GbaTeamState.Active:
                str += "tb_active";
                break;
            case GbaTeamState.Target:
                str += "tb_target";
                break;
            case GbaTeamState.Dead:
                str += "tb_dead";
                break;
            case GbaTeamState.Inactive:
            default:
                str += "tb_inactive";
                break;
        }
        
        this.team_box.className = str;
    }
    
    get_id()
    {
        return this.id;
    }
    
    get_name()
    {
        return this.name;
    }
    
    check_death()
    {
        if (this.is_dead())
        {
            this.die();
        }
    }
    
    die()
    {
        this.lives = 0;
        this.state = GbaTeamState.Dead;
    }
    
    is_dead()
    {
        return this.lives <= 0;
    }
    
    take_dagger_hit()
    {
        this.lives -= 1;
        this.check_death();
    }
    
    take_gun_hit()
    {
        this.lives -= 2;
        this.check_death();
    }
    
    take_bomb_hit()
    {
        this.lives -= 1;
        this.check_death();
    }
    
    take_heart()
    {
        this.lives += 1;
    }
    
    take_angel()
    {
        this.lives += 2;
    }
}


class GunsBombsAngels
{
  constructor()
  {
    this.cur_team = 0;
    this.team_cnt = 0;
    this.teams = new Array();
    this.team_lives = 10;
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
    this.form = document.createElement("form");
    this.sts_frme = document.createElement("div");
  }
  
  launch_game()
  {
        this.store_vals();
        this.generate_fields();
        this.add_teams();
        this.clear();
        this.render_game_status();
        this.render_table();
        this.hide_form();
        this.start_game(Math.floor(Math.random() * this.team_cnt))
  }
  
  start_game(cur_team)
  {
    this.cur_team = cur_team;
    this.teams[cur_team].activate();
  }
  
  add_team()
  {
    this.teams[this.team_cnt] = new GbaTeam(this.team_lives, ""+(this.team_cnt+1));
    this.team_cnt++;
  }
  
  pick_tgt_team(src_team_id)
  {
    if (this.team_cnt <= 2)
    {
        let tgt_id = (src_team_id + 1) % this.team_cnt;
        this.teams[tgt_id].target()
        return this.teams[tgt_id]
    }
    
  }
  
  get_cur_team()
  {
    return this.teams[this.cur_team]
  }
  
  next_team()
  {
    let cur_team = this.get_cur_team();
    cur_team.deactivate();
    
    this.cur_team = (this.cur_team + 1) % this.team_cnt;
    this.teams[this.cur_team].activate();
  }
  
  game_step(action)
  {
    let cur_team = this.get_cur_team();
    let tgt_team = null
    switch(action)
    {
        case GbaType.Dagger:
            tgt_team = this.pick_tgt_team(cur_team.get_id());
            tgt_team.take_dagger_hit();
            tgt_team.draw();
            break;
        case GbaType.Bomb:
            cur_team.take_bomb_hit();
            break;
        case GbaType.Heart:
            cur_team.take_heart();
            break;
        case GbaType.Gun:
            tgt_team = this.pick_tgt_team(cur_team.get_id());
            tgt_team.take_gun_hit();
            tgt_team.draw();
            break;
        case GbaType.Angel:
            cur_team.take_angel();
            break;
        default:
        case GbaType.Nothing:
            break;
    }
    
    cur_team.draw();
    
    this.next_team()
  }
  
  render(root_e)
  {
    root_e.appendChild(this.gba_div);
  }
  
  clear()
  {
    this.gba_div_out.replaceChildren();
  }
  
  add_teams()
  {
    for(let i = 0; i < this.teams_e.get(); i++)
    {
        this.add_team();
    }
  }
  
  render_form()
  {
    this.rows_e = new NumInput("rows", 5, "Rows:")
    this.rows_e.render(this.form)
    
    this.cols_e = new NumInput("cols", 5, "Cols:")
    this.cols_e.render(this.form)
    
    this.teams_e = new NumInput("teams", 2, "Teams:")
    this.teams_e.render(this.form)
    
    this.lives_e = new NumInput("lives", 10, "Lives:")
    this.lives_e.render(this.form)
    
    this.btn_e = new GenBtn("submit", "Generate!")
    this.btn_e.set_gba(this)
    this.btn_e.render(this.form)
    
    this.gba_div.appendChild(this.form)
    this.gba_div.appendChild(this.gba_div_out)
  }
  
  hide_form()
  {
    this.form.style.display = "none";
  }
  
  generate_fields()
  {
    this.table = new Array();
    
    let total = this.rows * this.cols;
    let dagger_num = Math.floor(total * GbaProb.Dagger);
    let heart_num = Math.floor(total * GbaProb.Heart);
    let bomb_num = Math.floor(total * GbaProb.Bomb);
    let angel_num = Math.floor(total * GbaProb.Angel);
    let gun_num = Math.floor(total * GbaProb.Gun);
    
    let none_num = total - (dagger_num + bomb_num + heart_num + angel_num + gun_num)
    
    for (let i = 0; i < dagger_num; i++)
    {
        this.table.push(new GbaCell(this,
                                    GbaType.Dagger,
                                    this.cell_dim_px,
                                    this.cell_dim_px));
    }
    for (let i = 0; i < heart_num; i++)
    {
        this.table.push(new GbaCell(this,
                                    GbaType.Heart,
                                    this.cell_dim_px,
                                    this.cell_dim_px));
    }
    for (let i = 0; i < bomb_num; i++)
    {
        this.table.push(new GbaCell(this,
                                    GbaType.Bomb,
                                    this.cell_dim_px,
                                    this.cell_dim_px));
    }
    for (let i = 0; i < angel_num; i++)
    {
        this.table.push(new GbaCell(this,
                                    GbaType.Angel,
                                    this.cell_dim_px,
                                    this.cell_dim_px));
    }
    for (let i = 0; i < gun_num; i++)
    {
        this.table.push(new GbaCell(this,
                                    GbaType.Gun,
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
  
  render_game_status()
  {
    for (let i = 0; i < this.team_cnt; i++)
    {
        this.teams[i].draw();
        this.sts_frme.appendChild(this.teams[i].get_team_box());
    }
    
    this.gba_div_out.appendChild(this.sts_frme);
  }
  
  render_table()
  {
    let x_px = this.cols * this.cell_dim_px
    let y_px = this.rows * this.cell_dim_px
    
    let frme = document.createElement("div")
    frme.style.width = (x_px + this.cell_dim_px + (this.cols*2 + 2)) + "px"
    frme.style.height = (y_px + this.cell_dim_px + (this.rows*2 + 2)) + "px"
    frme.className = "gba_frame"
    
    let field = document.createElement("div")
    field.style.width = (x_px + (this.cols*2)) + "px"
    field.style.height = (y_px + (this.rows*2)) + "px"
    field.className = "gba_field"
    
    let x_axis = document.createElement("div")
    x_axis.style.width = (x_px + (this.cols*2)) + "px"
    x_axis.style.height = this.cell_dim_px + "px"
    x_axis.style.marginLeft = this.cell_dim_px + "px"
    
    for (let i = 0; i < this.cols; i++)
    {
        let el = document.createElement("div")
        el.style.width = this.cell_dim_px + "px"
        el.style.height = this.cell_dim_px + "px"
        el.style.lineHeight = this.cell_dim_px + "px"
        el.className = "gba_col_heading"
        el.textContent = String.fromCharCode(65 + i)
        x_axis.appendChild(el);
    }
    
    let y_axis = document.createElement("div")
    y_axis.style.width = (this.cell_dim_px) + "px"
    y_axis.style.height = (y_px + (this.rows*2)) + "px"
    y_axis.className = "gba_y_axis"
    
    for (let i = 0; i < this.rows; i++)
    {
        let el = document.createElement("div");
        el.style.width = this.cell_dim_px + "px";
        el.style.height = this.cell_dim_px + "px";
        el.style.lineHeight = this.cell_dim_px + "px";
        el.className = "gba_row_heading"
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
