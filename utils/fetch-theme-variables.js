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


let css_string = `:root {\n`

color_groups = color_groups.map((color_set, i) => {
    let name = color_set.name
    let id = `${color_set.name.toLowerCase().replace(/[\s|&;$%@'"<>()+,]/g, "_")}${i}`
    let background = color_set.background_color
    let foreground = color_set.foreground_color
    let interaction = color_set.interaction_color
    
    css_string += `--${id}__background : ${background};\n`
    css_string += `--${id}__foreground : ${foreground};\n`
    css_string += `--${id}__interaction : ${interaction};\n`

    return {
        id,
        name,
        background,
        foreground,
        interaction
    }
})

css_string += `}\n` // end of :root

//start of classes
css_string += `.component {\n`
css_string += `--main-background-color: #000000;\n`
css_string += `--main-text-color: #ffffff;\n`
css_string += `--interaction-color: #2566f2;\n`
css_string += `background-color: var(--main-background-color);\n`
css_string += `color: var(--main-text-color);\n`


color_groups.forEach((color_set, i) => {
    let obj = {
        "name" : color_set.name,
        "id" : color_set.id
    }

    config['_inputs']['color_group']['options']['values'].push(obj)
    
    css_string += `&--${color_set.id} {\n`
    css_string += `--main-background-color: var(--${color_set.id}__background);\n`
    css_string += `--main-text-color: var(--${color_set.id}__foreground);\n`
    css_string += `--interaction-color: var(--${color_set.id}__interaction);\n`
    css_string += `}\n`
})
css_string += `}\n\n`

css_string += `.c-navigation{\n`

let nav_color_group_background = color_groups.filter(x => x.id === dataFile.nav_color_group)[0]?.background
let nav_color_group_foreground = color_groups.filter(x => x.id === dataFile.nav_color_group)[0]?.foreground

css_string += `--main-background-color: ${nav_color_group_background};\n`
css_string += `--main-text-color: ${nav_color_group_foreground};\n`

css_string += `}\n`

// adjust options for nav_color_group and footer_color_group
config['_inputs']['nav_color_group']['options']['values'] = Array.from(config['_inputs']['color_group']['options']['values'])
config['_inputs']['footer_color_group']['options']['values'] = Array.from(config['_inputs']['color_group']['options']['values'])

fs.writeFileSync(configFileLocation, yaml.dump(config))

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