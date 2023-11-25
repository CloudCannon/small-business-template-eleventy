const fs = require('fs');
const yaml = require('js-yaml')

// read theme colors and fonts from data/theme.json
fs.readFile('src/_data/theme.json', 'utf8', (err, dataFile) => {
    
    if(err){
        console.log(err);
        return;
    }
    
    // parse file to JSON so that the variables can be accessed
    dataFile = JSON.parse(dataFile);

    let site_colors = dataFile["site_colors"]
    delete dataFile["site_colors"]

    //change cloudcannon.config
    const configFileLocation = './cloudcannon.config.yml'

    let config = yaml.load(fs.readFileSync(configFileLocation,'utf-8'))
    config['_inputs']['background_variant']['options']['values'] = []

    const colorsFileLocation = './src/assets/styles/site_colors.scss'
    if(fs.existsSync(colorsFileLocation))
        fs.unlinkSync(colorsFileLocation)
    fs.writeFileSync(colorsFileLocation, "")

    let css_string = `:root {\n`

    site_colors.forEach(color_set => {
        let name = color_set.name.toLowerCase().replaceAll(/(\s|')/g, "_")
        let background = color_set.background_color
        let foreground = color_set.foreground_color
        
        css_string += `--${name}__background : ${background};\n`
        css_string += `--${name}__foreground : ${foreground};\n`
    })

    css_string += `}\n` // end of :root

    //start of classes
    css_string += `.component {\n`
    site_colors.forEach(color_set => {
        let name = color_set.name.toLowerCase().replaceAll(/(\s|')/g, "_")

        let obj = {
            "name" : color_set.name,
            "id" : name
        }

        config['_inputs']['background_variant']['options']['values'].push(obj)
        
        css_string += `&--${name} {\n`
        css_string += `background-color: var(--${name}__background);\n`
        css_string += `color: var(--${name}__foreground);\n`
        css_string += `}\n`
    })
    css_string += `}\n`

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

})