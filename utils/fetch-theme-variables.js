const fs = require('fs');
const yaml = require('js-yaml')

// read theme colors and fonts from data/theme.json
//fs.readFile('src/_data/theme.json', 'utf8', (err, dataFile) => {
let dataFile = yaml.load(fs.readFileSync('src/_data/theme.yml','utf-8'))
    
/*if(err){
    console.log(err);
    return;
}*/

// parse file to JSON so that the variables can be accessed
//dataFile = JSON.parse(dataFile);

let color_groups = dataFile["color_groups"]
delete dataFile["color_groups"]

//change cloudcannon.config
const configFileLocation = './cloudcannon.config.yml'

let config = yaml.load(fs.readFileSync(configFileLocation,'utf-8'))
config['_inputs']['color_group']['options']['values'] = []

const colorsFileLocation = './src/assets/styles/color_groups.scss'
if(fs.existsSync(colorsFileLocation))
    fs.unlinkSync(colorsFileLocation)
fs.writeFileSync(colorsFileLocation, "")


let css_string_root = `:root {\n`
let css_string_component = `.component {\n`
let css_string_nav = `.c-navigation {\n`
let css_string_footer = `.c-footer {\n`

css_string_component += `--main-background-color: #3B3B3D;\n`
css_string_component += `--main-text-color: #F9F9FB;\n`
css_string_component += `--interaction-color: #2566f2;\n`
css_string_component += `background-color: var(--main-background-color);\n`
css_string_component += `color: var(--main-text-color);\n`

css_string_nav += `--main-background-color: #1B1B1D;\n`
css_string_nav += `--main-text-color: #D9D9DC;\n`

css_string_footer += `--main-background-color: #1B1B1D;\n`
css_string_footer += `--main-text-color: #D9D9DC;\n`


let addColorDefinitions = (str, id) => {
    str += `&--${id} {\n`
    str += `--main-background-color: var(--${id}__background);\n`
    str += `--main-text-color: var(--${id}__foreground);\n`
    str += `--interaction-color: var(--${id}__interaction);\n`
    str += `}\n`    
    return str
}

color_groups = color_groups.forEach((color_set, i) => {
    let id = `${color_set.name.toLowerCase().replace(/[\s|&;$%@'"<>()+,]/g, "_")}${i}`
    let name = color_set.name
    let background = color_set.background_color
    let foreground = color_set.foreground_color
    let interaction = color_set.interaction_color
    
    let obj = { name, id }
    config['_inputs']['color_group']['options']['values'].push(obj)
    
    css_string_root += `--${id}__background : ${background};\n`
    css_string_root += `--${id}__foreground : ${foreground};\n`
    css_string_root += `--${id}__interaction : ${interaction};\n`
    
    css_string_component = addColorDefinitions(css_string_component, id)      
    css_string_nav = addColorDefinitions(css_string_nav, id)      
    css_string_footer = addColorDefinitions(css_string_footer, id)        
})
css_string_root += `}\n\n`
css_string_component += `}\n\n`
css_string_nav += `}\n\n`
css_string_footer += `}\n\n`

// adjust options for nav_color_group and footer_color_group
config['_inputs']['nav_color_group']['options']['values'] = Array.from(config['_inputs']['color_group']['options']['values'])
config['_inputs']['footer_color_group']['options']['values'] = Array.from(config['_inputs']['color_group']['options']['values'])

fs.writeFileSync(configFileLocation, yaml.dump(config))

let css_string = `${css_string_root}${css_string_component}${css_string_nav}${css_string_footer}`
fs.appendFileSync(colorsFileLocation, css_string)

const variableFileLocation = './src/assets/styles/variables.scss'

fs.readFile(variableFileLocation, 'utf-8', (err, cssFile) => {

    if(err){
        console.log(err);
        return;
    }

    let replaced = cssFile;

    // Change the variables to whatever was set in the data file
    Object.entries(dataFile).forEach(([k,v]) => {
        k = k.split("_").join("-");
        const re = new RegExp(`--${k}: .*`, 'g')
        replaced = replaced.replace(re,`--${k}: ${v};`)
    })

    // Write result back to variables.css
    fs.writeFile(variableFileLocation, replaced, 'utf-8', err => {
        if(err)
            console.log(err);
        
        console.log(`📚 Writing variables to ${variableFileLocation}`)
    });
});