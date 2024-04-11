import './App.css';
import {useState} from "react";
import {buildTimeValue} from "@testing-library/user-event/dist/utils";


function setCookie(name,value,days) {
    let expires = "";
    if (days) {
        let date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}
function getCookie(name) {
    let nameEQ = name + "=";
    let ca = document.cookie.split(';');
    for(let i=0;i < ca.length;i++) {
        let c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}
function eraseCookie(name) {
    document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

function App() {
    const [inputFields, setInputFields] = useState([
        {value: ' '}
    ])
    const [usePrices, setUsePrices] = useState(false)

    const handleFormChange = (index, event) => {
        let data = [...inputFields];
        data[index][event.target.name] = event.target.value;
        setInputFields(data);

        processText();
    }

    const handlePriceChange = (index, event, type, subtype) => {
        let data = [...inputFields];
        data[index][event.target.name] = event.target.value;

        setCookie(type + subtype, event.target.value, 7);
        setInputFields(data);

        if(usePrices) processText();
    }

    // Format -> [type][sub type][0 ==> price | 1 ==> inventory]
    const inventory = {
        increase: {
            life: [0, 0], mana: [0, 0], defence: [0, 0], attribute: [0, 0], resistance: [0, 0], gem: [0, 0],
            attack: [0, 0], caster: [0, 0], minion: [0, 0], critical: [0, 0], speed: [0, 0],
            elemental: [0, 0], fire: [0, 0], cold: [0, 0], lightning: [0, 0], physical: [0, 0], chaos: [0, 0],
            prefix: [0, 0], suffix: [0, 0], haunted: [0, 0],
        },
        scarcer: {
            life: [0, 0], mana: [0, 0], defence: [0, 0], attribute: [0, 0], resistance: [0, 0], gem: [0, 0],
            attack: [0, 0], caster: [0, 0], critical: [0, 0], speed: [0, 0],
            elemental: [0, 0], fire: [0, 0], cold: [0, 0], lightning: [0, 0], physical: [0, 0], chaos: [0, 0],
        },
        meta: {
            expPlus: [0, 0], expSub: [0, 0], itemLvl: [0, 0], quality: [0, 0],
            modTier: [0, 0],
            additional: [0, 0], fracture: [0, 0], split: [0, 0], mirror: [0, 0],
            sacred: [0, 0], divine: [0, 0], blessed: [0, 0],
            socket: [0, 0], link: [0, 0], l4: [0, 0], l5: [0, 0], l6: [0, 0],
        },
        adjacent: {
            beast: [0, 0], humanoid: [0, 0], undead: [0, 0], construct: [0, 0], demon: [0, 0],
            row: [0, 0], col: [0, 0],
            randomize: [0, 0],
        }
    }

    const priceEntry = (text = "NA", type = "NA", color = "#ffffff",  target = text) => {
        let price = (getCookie(type + target) != null) ? getCookie(type + target) : 0;

         return (<form className="price-entry">
             {inputFields.map((input, index) => {
                 return (<>
                     <div key={index}>
                         <p className="centered" style={{color: color, fontFamily:"Impact", font:"bold"}}>{text.toUpperCase()}</p>
                                <input
                                    id={type + target}
                                    name={type + target}
                                    rows='15'
                                    cols='100'
                                    value={input.input}
                                    placeholder={price}
                                    style={{borderColor: color}}
                                    className="w-9/12 self-center"
                                    onChange={event => handlePriceChange(index, event, type, target)}
                                />
                     </div>
                 </>)
             })}
         </form>)
    }

    const toggleUsePrices = () => {
        setUsePrices(!usePrices);

        processText();
        processText();
    }

    const savePrices = () => {
        for(const type in inventory) {
            for(const subtype in inventory[type]) {
                if(document.getElementById(type + subtype) != null) {
                    let value = (document.getElementById(type + subtype).value)
                    if(value == null) setCookie(type + subtype, 0, 7);
                    setCookie(type + subtype, document.getElementById(type + subtype).value);
                }
            }
        }
    }

    const processLine = (text) => {
        let type, subtype;
        if (text.includes("sed chance") || text.includes("scarcer")) {
            // DO specific increase mods
            if (text.includes("increased")) {
                type = "increase";
                if (text.includes("Prefix")) subtype = "prefix";
                if (text.includes("Suffix")) subtype = "suffix";
                if (text.includes("Minion")) subtype = "minion";
                if (text.includes("roll Haunted")) subtype = "haunted";
            } else if (text.includes("scarcer")) type = "scarcer";

            if (text.includes("Life")) subtype = "life";
            if (text.includes("Mana")) subtype = "mana";
            if (text.includes("Defence")) subtype = "defence";
            if (text.includes("Attribute")) subtype = "attribute";
            if (text.includes("Resistance")) subtype = "resistance";
            if (text.includes("Gem")) subtype = "gem";
            if (text.includes("Attack")) subtype = "attack";
            if (text.includes("Caster")) subtype = "caster";
            if (text.includes("Critical")) subtype = "critical";
            if (text.includes("Speed")) subtype = "speed";
            if (text.includes("Elemental")) subtype = "elemental";
            if (text.includes("Fire")) subtype = "fire";
            if (text.includes("Cold")) subtype = "cold";
            if (text.includes("Lightning")) subtype = "lightning";
            if (text.includes("Physical")) subtype = "physical";
            if (text.includes("Chaos")) subtype = "chaos";
        } else if (text.includes("adjacent")) {
            type = "adjacent"
            if (text.includes("Beast")) subtype = "beast";
            if (text.includes("Demon")) subtype = "demon";
            if (text.includes("Construct")) subtype = "construct";
            if (text.includes("Human")) subtype = "humanoid";
            if (text.includes("Undead")) subtype = "undead";
            if (text.includes("randomised")) subtype = "randomize";
        }
        // Meta Mods
        else {
            type = "meta";
            if (text.includes("+1 Explicit")) subtype = "expPlus";
            if (text.includes("-1 Explicit")) subtype = "expSub";
            if (text.includes("Item Level")) subtype = "itemLvl";
            if (text.includes("Quality")) subtype = "quality";
            if (text.includes("50 to Mod")) subtype = "modTier";
            if (text.includes("Row")) {subtype = "row"; type = "adjacent"}
            if (text.includes("Column")) {subtype = "col"; type = "adjacent"};
            if (text.includes("additional Item")) subtype = "additional";
            if (text.includes("Fracture")) subtype = "fracture";
            if (text.includes("Split")) subtype = "split";
            if (text.includes("irror")) subtype = "mirror";
            if (text.includes("Reroll Impli")) subtype = "blessed";
            if (text.includes("Reroll Mod")) subtype = "divine";
            if (text.includes("base Defences")) subtype = "sacred";
            if (text.includes("socket numbers")) subtype = "socket";
            if (text.includes("socket links")) subtype = "link";
            if (text.includes("mum of 4")) subtype = "l4";
            if (text.includes("mum of 5")) subtype = "l5";
            if (text.includes("mum of 6")) subtype = "l6";
        }

        if (subtype == null) return;

        // Get Price from TFT Bulk
        inventory[type][subtype][0] += parseInt(text.substring(0, text.indexOf('x')));

        if(!usePrices)
            inventory[type][subtype][1] = Math.round(parseFloat(text.substring(text.indexOf(':') + 1, text.indexOf('c/ea'))));
        else {
            if (document.getElementById(type + subtype) != null) {
                inventory[type][subtype][1] = getCookie(type + subtype);
            }
            else {
                inventory[type][subtype][1] = 0
                setCookie(type + subtype, 0, 7);
            }
        }
    }

    const processText = () => {
        // Iterate Through each Line
        let input = document.getElementById('input').value;
        let lines = input.split('\n');
        let output = "";

        for(const type in inventory) {
            for(const subtype in inventory[type]) {
                inventory[type][subtype] = [0, 0];
            }
        }

        for (let i = 6; i < lines.length; i++) {
            processLine(lines[i]);
        }

        document.getElementById('output').value = printListing();
    }

    const printListing = () => {
        let inc = inventory.increase, sca = inventory.scarcer, adj = inventory.adjacent, meta = inventory.meta;
        let has_category = {increase: false, scarcer: false, adjacent: false, meta: false}
        for(const type in inventory) {
            for(const subtype in inventory[type]) {
                if(inventory[type][subtype][0] > 0) has_category[type] = true;
            }
        }
        
        let output = `WTS Softcore
Corspe ilvl [PUT CORPSE ILVLs HERE]
IGN: \`[PUT-IGN-HERE]\`
\`\`\`\n`
        if(has_category.increase) output += `----------------Increased------Scarcer\n`;
        if(inc.physical[0] + sca.physical[0] > 0) output +=     (`Physical     | ${inc.physical[1]}c/ea : ${inc.physical[0]}   | ${sca.physical[1]}c/ea : ${sca.physical[0]}\n`);
        if(inc.chaos[0] + sca.chaos[0] > 0) output +=           (`Chaos        | ${inc.chaos[1]}c/ea : ${inc.chaos[0]}   | ${sca.chaos[1]}c/ea : ${sca.chaos[0]}\n`);
        if(inc.elemental[0] + sca.elemental[0] > 0) output +=   (`Elemental    | ${inc.elemental[1]}c/ea : ${inc.elemental[0]}   | ${sca.elemental[1]}c/ea : ${sca.elemental[0]}\n`);
        if(inc.fire[0] + sca.fire[0] > 0) output +=               (`Fire         | ${inc.fire[1]}c/ea : ${inc.fire[0]}   | ${sca.fire[1]}c/ea : ${sca.fire[0]}\n`);
        if(inc.cold[0] + sca.cold[0] > 0) output +=             (`Cold         | ${inc.cold[1]}c/ea : ${inc.cold[0]}   | ${sca.cold[1]}c/ea : ${sca.cold[0]}\n`);
        if(inc.lightning[0] + sca.lightning[0] > 0) output +=   (`Lightning    | ${inc.lightning[1]}c/ea : ${inc.lightning[0]}   | ${sca.lightning[1]}c/ea : ${sca.lightning[0]}\n`);
        if(inc.life[0] + sca.life[0] > 0) output +=             (`Life         | ${inc.life[1]}c/ea : ${inc.life[0]}   | ${sca.life[1]}c/ea : ${sca.life[0]}\n`);
        if(inc.mana[0] + sca.mana[0] > 0) output +=             (`Mana         | ${inc.mana[1]}c/ea : ${inc.mana[0]}   | ${sca.mana[1]}c/ea : ${sca.mana[0]}\n`);
        if(inc.defence[0] + sca.defence[0] > 0) output +=       (`Defence      | ${inc.defence[1]}c/ea : ${inc.defence[0]}   | ${sca.defence[1]}c/ea : ${sca.defence[0]}\n`);
        if(inc.resistance[0] + sca.resistance[0] > 0) output += (`Resistance   | ${inc.resistance[1]}c/ea : ${inc.resistance[0]}   | ${sca.resistance[1]}c/ea : ${sca.resistance[0]}\n`);
        if(inc.attribute[0] + sca.attribute[0] > 0) output +=   (`Attribute    | ${inc.attribute[1]}c/ea : ${inc.attribute[0]}   | ${sca.attribute[1]}c/ea : ${sca.attribute[0]}\n`);
        if(inc.attack[0] + sca.attack[0] > 0) output +=         (`Attack       | ${inc.attack[1]}c/ea : ${inc.attack[0]}   | ${sca.attack[1]}c/ea : ${sca.attack[0]}\n`);
        if(inc.caster[0] + sca.caster[0] > 0) output +=         (`Caster       | ${inc.caster[1]}c/ea : ${inc.caster[0]}   | ${sca.caster[1]}c/ea : ${sca.caster[0]}\n`);
        if(inc.critical[0] + sca.critical[0] > 0) output +=     (`Critical     | ${inc.critical[1]}c/ea : ${inc.critical[0]}   | ${sca.critical[1]}c/ea : ${sca.critical[0]}\n`);
        if(inc.speed[0] + sca.speed[0] > 0) output +=           (`Speed        | ${inc.speed[1]}c/ea : ${inc.speed[0]}   | ${sca.speed[1]}c/ea : ${sca.speed[0]}\n`);
        if(inc.gem[0] + sca.gem[0] > 0) output  +=              (`Gem          | ${inc.gem[1]}c/ea : ${inc.gem[0]}   | ${sca.gem[1]}c/ea : ${sca.gem[0]}\n`);
        if(inc.minion[0] > 0) output +=                         (`Minion       | ${inc.minion[1]}c/ea : ${inc.minion[0]}\n`);
        if(inc.prefix[0] > 0) output +=                          (`Prefix        | ${inc.prefix[1]}c/ea : ${inc.prefix[0]}\n`);
        if(inc.suffix[0] > 0) output +=                          (`Suffix        | ${inc.suffix[1]}c/ea : ${inc.suffix[0]}\n`);
        if(inc.haunted[0] > 0) output +=                       (`Haunted      | ${inc.haunted[1]}c/ea : ${inc.haunted[0]}\n`);
        if(has_category.adjacent) output +=`-----------== Positional ==---------------\n`;
        if(adj.row[0] > 0) output +=                            `25% Row       | ${adj.row[1]}c/ea  : ${adj.row[0]}\n`;
        if(adj.col[0] > 0) output +=                            `25% Column    | ${adj.col[1]}c/ea  : ${adj.col[0]}\n`
        if(adj.beast[0] > 0) output +=                          `40% Beast     | ${adj.beast[1]}c/ea  : ${adj.beast[0]}\n`;
        if(adj.construct[0] > 0) output +=                      `40% Construct | ${adj.construct[1]}c/ea  : ${adj.construct[0]}\n`;
        if(adj.demon[0] > 0) output +=                          `40% Demon     | ${adj.demon[1]}c/ea  : ${adj.demon[0]}\n`;
        if(adj.humanoid[0] > 0) output +=                       `40% Humanoid  | ${adj.humanoid[1]}c/ea  : ${adj.humanoid[0]}\n`;
        if(adj.undead[0] > 0) output +=                         `40% Undead    | ${adj.undead[1]}c/ea  : ${adj.undead[0]}\n`;
        if(adj.randomize[0] > 0) output +=                      `Randomize Adj | ${adj.randomize[1]}c/ea  : ${adj.randomize[0]}\n`;
        if(has_category.meta) output += `------------== Meta ==---------------------\n`;
        if(meta.modTier[0] > 0) output +=                       `+50 Mod Tier    | ${meta.modTier[1]}c/ea : ${meta.modTier[0]}\n`;
        if(meta.additional[0] > 0) output +=                    `Additional      | ${meta.additional[1]}c/ea : ${meta.additional[0]}\n`;
        if(meta.fracture[0] > 0) output +=                      `Fracture        | ${meta.fracture[1]}c/ea : ${meta.fracture[0]}\n`;
        if(meta.mirror[0] > 0) output +=                        `Mirror          | ${meta.mirror[1]}c/ea : ${meta.mirror[0]}\n`;
        if(meta.split[0] > 0) output +=                         `Split           | ${meta.split[1]}c/ea : ${meta.split[0]}\n`;
        if(meta.divine[0] > 0) output +=                        `Reroll explicit | ${meta.divine[1]}c/ea : ${meta.divine[0]}\n`;
        if(meta.blessed[0] > 0) output +=                       `Reroll implicit | ${meta.blessed[1]}c/ea : ${meta.blessed[0]}\n`;
        if(meta.sacred[0] > 0) output +=                        `Reroll defences | ${meta.sacred[1]}c/ea : ${meta.sacred[0]}\n`;
        if(meta.expPlus[0] > 0) output +=                       `+1 Explicit     | ${meta.expPlus[1]}c/ea  : ${meta.expPlus[0]}\n`;
        if(meta.expSub[0] > 0) output +=                        `-1 Explicit     | ${meta.expSub[1]}c/ea : ${meta.expSub[0]}\n`;
        if(meta.itemLvl[0] > 0) output +=                       `+1 Item level   | ${meta.itemLvl[1]}c/ea : ${meta.itemLvl[0]}\n`;
        if(meta.quality[0] > 0) output +=                       `5% quality      | ${meta.quality[1]}c/ea  : ${meta.quality[0]}\n`;
        if(meta.socket[0] > 0) output +=                        `Reroll sockets  | ${meta.socket[1]}c/ea : ${meta.socket[0]}\n`
        if(meta.link[0] > 0) output +=                          `Reroll links    | ${meta.link[1]}c/ea : ${meta.link[0]}\n`
        if(meta.l4[0] > 0) output +=                            `Add link (4)    | ${meta.l4[1]}c/ea : ${meta.l4[0]}\n`
        if(meta.l5[0] > 0) output +=                            `Add link (5)    | ${meta.l5[1]}c/ea : ${meta.l5[0]}\n`
        if(meta.l6[0] > 0) output +=                            `Add link (6)    | ${meta.l6[1]}c/ea : ${meta.l6[0]}\n`
        output += `\`\`\``;
        return output;
    }

    const loadPrices = () => {
        for(const type in inventory) {
            for(const subtype in inventory[type]) {
                if(document.getElementById(type + subtype) != null) {
                    document.getElementById(type + subtype).value = getCookie(type + subtype);
                }
            }
        }
    }


    const usePricesColor = (usePrices) ? "#3a3a3a" : "rgba(185,185,185,0.32)";
    return (
        <div className="centered">
            <h1 className="font-bold">Wafer's Janky Corpse Sale Formatter</h1>
            <div className="window">
                <h2 className="underline">How to Use</h2>
                <p> 1. Login to <a href="https://bulk.tftrove.com/" target="_blank" className="accent-blue-500">TFT Bulk Tool</a></p>
                <p> 2. Pick your relevant tabs + coffin option </p>
                <p> 3. Hit Full Text & Nitro</p>
                <p> 4. Generate Text </p>
                <p> 5. Paste generated text into the box below and hit trade</p>
                <p> 6. Change prices as needed in the output box </p>
                <p className="warning"> * Will not do unique and base-type corpses * </p>
                <p className="warning"> * Not a perfect tool but good enough for me * </p>

                <div className="tab-row">
                    <form>
                        {inputFields.map((input, index) => {
                            return (<>
                                <div key={index}>
                                    <textarea
                                        id='input'
                                        name='inputText'
                                        rows='15'
                                        cols='100'
                                        value={input.input}
                                        style={{marginRight: 0}}
                                        className="w-9/12 self-center"
                                        onChange={event => handleFormChange(index, event)}
                                    />
                                </div>
                            </>)
                        })}
                    </form>
                    <form>
                        {inputFields.map((input, index) => {
                            return (<>
                                <div key={index}>
                                            <textarea
                                                id='output'
                                                name='outputText'
                                                rows='15'
                                                cols='100'
                                                value={input.input}
                                                className="w-9/12 self-center"
                                                onChange={event => handleFormChange(index, event)}
                                            />
                                </div>
                            </>)
                        })}
                    </form>
                </div>

                Prices
                <div className="tab-line">
                    {<button style={{width: 180, height: 50,
                    color:"#ffffff", backgroundColor: usePricesColor}} onClick={() => toggleUsePrices()}>
                        Use Custom</button>}
                    {<button style={{width: 180, height: 50, margin: "5px"}} onClick={() => {savePrices();}}> Save Prices</button>}
                    {<button style={{width: 180, height: 50}} onClick={() => {loadPrices();}}> Load Prices</button>}

                </div>

                <p>Increases:</p>
                <div className="tab-line">
                    {priceEntry("physical", "increase", "#c69d93")}
                    {priceEntry("chaos", "increase", "#54337d")}
                    {priceEntry("elemental", "increase", "#ffc5a6")}
                    {priceEntry("fire", "increase", "#f47257")}
                    {priceEntry("cold", "increase", "#92efff")}
                    {priceEntry("lightning", "increase", "#ffc650")}
                    {priceEntry("life", "increase", "#ff615f")}
                    {priceEntry("mana", "increase", "#4e8bff")}
                    {priceEntry("defence", "increase", "#fdd17d")}
                    {priceEntry("resistance", "increase", "#ffe9c7")}
                    {priceEntry("attribute", "increase", "#e59c15")}
                    {priceEntry("attack", "increase", "#da8049")}
                    {priceEntry("caster", "increase", "#b2f7fe")}
                    {priceEntry("critical", "increase", "#b2a7d7")}
                    {priceEntry("speed", "increase", "#cdeca4")}
                    {priceEntry("minion", "increase", "#d5a4cf")}
                    {priceEntry("prefix", "increase", "#ffffff")}
                    {priceEntry("suffix", "increase", "#ffffff")}
                    {priceEntry("haunted", "increase", "#acacac")}
                </div>

                <p>Scarcer:</p>
                <div className="tab-line">
                    {priceEntry("physical", "scarcer", "#c69d93")}
                    {priceEntry("chaos", "scarcer", "#54337d")}
                    {priceEntry("elemental", "scarcer", "#ffc5a6")}
                    {priceEntry("fire", "scarcer", "#f47257")}
                    {priceEntry("cold", "scarcer", "#92efff")}
                    {priceEntry("lightning", "scarcer", "#ffc650")}
                    {priceEntry("life", "scarcer", "#ff615f")}
                    {priceEntry("mana", "scarcer", "#4e8bff")}
                    {priceEntry("defence", "scarcer", "#fdd17d")}
                    {priceEntry("resistance", "scarcer", "#ffe9c7")}
                    {priceEntry("attribute", "scarcer", "#e59c15")}
                    {priceEntry("attack", "scarcer", "#da8049")}
                    {priceEntry("caster", "scarcer", "#b2f7fe")}
                    {priceEntry("critical", "scarcer", "#b2a7d7")}
                    {priceEntry("speed", "scarcer", "#cdeca4")}
                </div>

                <p>Meta:</p>
                <div className="tab-line">
                    {priceEntry("+50 Mod Tier", "meta", "#ffffff", "modTier")}
                    {priceEntry("Additional Craft", "meta", "#ffffff", "additional")}
                    {priceEntry("Fracture", "meta", "#ffffff", "fracture")}
                    {priceEntry("Split", "meta", "#ffffff", "split")}
                    {priceEntry("Mirror", "meta", "#ffffff", "mirror")}
                    {priceEntry("Reroll Explicits", "meta", "#ffffff", "divine")}
                    {priceEntry("Reroll Implicits", "meta", "#ffffff", "blessed")}
                    {priceEntry("Reroll Defences", "meta", "#ffffff", "sacred")}
                    {priceEntry("+1 Explicit", "meta", "#ffffff", "expPlus")}
                    {priceEntry("-1 Explicit", "meta", "#ffffff", "expSub")}
                    {priceEntry("+1 Item Level", "meta", "#ffffff", "itemLvl")}
                    {priceEntry("5% Quality", "meta", "#ffffff", "quality")}
                    {priceEntry("Reroll Sockets", "meta", "#ffffff", "socket")}
                    {priceEntry("Reroll Links", "meta", "#ffffff", "link")}
                    {priceEntry("Add Link (max 4)", "meta", "#ffffff", "l4")}
                    {priceEntry("Add Link (max 5)", "meta", "#ffffff", "l5")}
                    {priceEntry("Add Link (max 6)", "meta", "#ffffff", "l6")}
                </div>

                <p>Positional:</p>
                <div className="tab-line">
                    {priceEntry("row", "adjacent", "#ffffff")}
                    {priceEntry("col", "adjacent", "#ffffff")}
                    {priceEntry("beast", "adjacent", "#ffffff")}
                    {priceEntry("humanoid", "adjacent", "#ffffff")}
                    {priceEntry("undead", "adjacent", "#ffffff")}
                    {priceEntry("construct", "adjacent", "#ffffff")}
                    {priceEntry("demon", "adjacent", "#ffffff")}
                    {priceEntry("randomize", "adjacent", "#ffffff")}
                </div>
            </div>
        </div>
    );

}

export default App;
