import React, {Component} from 'react';
import "./Correction.css";
import {Button, Card} from "@mui/material";
import TextUpload from "../wordanalyser/textupload/TextUpload";

//history to keep all changes step-by-step made to alasisu
let history = [
  "",
]

//integer for indexing history with undo and redo
let currentHistory = 0

class Correction extends Component {
  constructor(props) {
    super(props);
    this.state = {
      alasisu: "", tasemevastus: ["algusväärtus"],
      tasemetekst: "",
      korrektorivastus: ["", ""],
      vastuskood: "", vastusnahtav: false, muutuskood: "", yksikmuutus: false, taustatekst: <span></span>,
      taselisa: false, avatudkaart: "korrektuur", kordab: false, sisukohad: [], sisusonad: [], vastussonad: [],
      paringlopetatud: false,
      keerukusvastus: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      mitmekesisusvastus: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      korrektuur: ""
    };
    this.handleRedo = this.handleRedo.bind(this)
    this.handleUndo = this.handleUndo.bind(this)
    this.sendTextFromFile = this.sendTextFromFile.bind(this)
    this.alaMuutus = this.alaMuutus.bind(this);
    this.ala1 = React.createRef();
    this.taust1 = React.createRef();
    this.kysi3 = this.kysi3.bind(this);
    this.korda = this.korda.bind(this);
  }


  puhasta(sona) {
    return sona.replace(/^[^0-9a-zA-ZõäöüÕÄÖÜ]+/, '').replace(/[^0-9a-zA-ZõäöüÕÄÖÜ]+$/, '')
  }

  puhasta2(sona) {
    let re = /(^[^0-9a-zA-ZõäöüÕÄÖÜ]*)(.*[0-9a-zA-ZõäöüÕÄÖÜ]+)([^0-9a-zA-ZõäöüÕÄÖÜ]*)/;
    return re.exec(sona);
  }


  kordama() {
    this.setState({kordab: true});
    this.korda();
    setInterval(this.korda, 3000);
  }

  korda() {
    if (this.state.alasisu === this.state.tasemetekst) {
      return;
    }
    this.kysi3();
    this.kysi4();
    this.kysi5();
    this.kysi6();
  }

  alaMuutus(event) {
    this.setState({alasisu: event.target.value}, function () {
      this.keepHistory();
    });
    this.kysi3();
  }

  asenda(algus, sisu, vahetus) {
    this.margi(algus, sisu);
    let uus = this.state.alasisu.substring(0, this.ala1.selectionStart) + vahetus +
      this.state.alasisu.substring(this.ala1.selectionEnd);
    this.setState({alasisu: uus}, function () {
      this.keepHistory();
    });
  }

  margi(algus, sisu, puhastab = false) {
    this.ala1.focus();
    let koht = this.state.alasisu.indexOf(sisu, (algus > 10 ? algus - 10 : algus));
    if (koht === -1) {
      koht = this.state.alasisu.indexOf(sisu);
    }
    this.ala1.selectionStart = koht;
    this.ala1.selectionEnd = koht + sisu.length;
    if (puhastab) {
      this.setState({yksikmuutus: false});
    }
    // scroll !!
  }

  kysi4 = () => {
    if (this.state.alasisu === this.state.tasemetekst) {
      return;
    }

    let obj = {};
    obj["tekst"] = this.state.alasisu;
    const asisu = this.state.alasisu;
    fetch("/api/texts/keeletase", {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(obj)
    }).then(v => v.json()).then(t => {
      this.setState({"tasemevastus": t});
      this.setState({tasemetekst: asisu});
    })
  }

  kysi5 = () => {
    let obj = {};
    obj["tekst"] = this.state.alasisu;
    fetch("/api/texts/keerukus", {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(obj)
    }).then(v => v.json()).then(t => {
      this.setState({"keerukusvastus": t});
    })
  }

  kysi6 = () => {
    let obj = {};
    obj["tekst"] = this.state.alasisu;
    fetch("/api/texts/mitmekesisus", {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(obj)
    }).then(v => v.json()).then(t => {
      this.setState({"mitmekesisusvastus": t});
    })
  }


  korrektuuriVajutus = () => {
    this.setState({avatudkaart: "korrektuur"})
    if (this.state.kordab) {
      this.kysi3();
    }
  }

  hindajaVajutus = () => {
    this.setState({avatudkaart: "hindamine"})
    if (this.state.kordab) {
      this.kysi4();
    }
  }

  keerukusVajutus = () => {
    this.setState({avatudkaart: "keerukus"})
  }

  mitmekesisusVajutus = () => {
    this.setState({avatudkaart: "mitmekesisus"})
  }

  kysi3 = () => {
    if (this.state.alasisu === this.state.korrektorivastus[1]) {
      return;
    }
    let obj = {};
    obj["tekst"] = this.state.alasisu;
    fetch("/api/texts/korrektuur", {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(obj)
    }).then(v => v.json()).then(t => {
      this.setState({"korrektorivastus": t});
      let sm = t[1].split(" ");
      let vm = t[0].split(" ");
      let vastustekst = [];
      let taustatekst = [];
      let sisutekst = "";
      let muutused = [];
      let sisukohad = [];

      if (sm === vm) {
        this.setState({korrektuur: "Kõik korras"});
      } else {
        for (let i = 0; i < vm.length; i++) {
          if (sm[i] === vm[i]) {
            vastustekst[i] = <span key={"s" + i}>{vm[i] + " "}</span>;
            taustatekst[i] = <span key={"t" + i}>{sm[i] + " "}</span>;
          } else {
            const algus = sisutekst.length;
            const sisu = sm[i];
            muutused[i] = <span key={"sm" + i}>
                <span onClick={() => this.margi(algus, sisu, true)}
                      style={{'backgroundColor': 'lightpink'}}>{sm[i]}</span> - <span>{vm[i]}</span> <button
              onClick={() => this.asenda(algus, sisu, vm[i])}>Asenda</button><br/>
             </span>
            let kpl = this.puhasta2(sm[i]);
            taustatekst[i] = <span key={"t" + i}><span>{kpl[1]}</span><span className="margitud"
                                                                            title={vm[i]}>{kpl[2]}</span><span>{kpl[3]}</span><span> </span></span>;
            vastustekst[i] = <span key={"s" + i}><span title={vm[i]}
                                                       onClick={() => this.margi(algus, sisu)}
                                                       style={{'backgroundColor': 'lightgray'}}>{sm[i]}</span><span> </span></span>;
          }
          sisutekst += sm[i] + " ";
          sisukohad[i] = sisutekst.length;
        }
      }
      this.setState({"muutuskood": <div>{muutused.length > 0 ? muutused : "puuduvad"}</div>})
      this.setState({"vastuskood": <div>{vastustekst}<br/><br/><br/><br/><br/><br/></div>})
      this.setState({"taustakood": <div>{taustatekst}</div>}, () => {
        this.kerimine()
      });
      this.setState({"sisukohad": sisukohad});
      this.setState({"sisusonad": sm});
      this.setState({"vastussonad": vm});
      this.setState({yksikmuutus: false});
      this.setState({"paringlopetatud": true});
    })
  }

  renderTasemed = () => {
    if (this.state.taselisa) {
      return <div onClick={() => this.setState({taselisa: false})}
                  style={{width: "100%"}}>
        Loe täpsemalt ↑
        <p style={{width: "100%"}}><b>Teksti üldine keerukus: <br/> {this.state.tasemevastus[4][1]} </b>
          (tõenäosus {(this.state.tasemevastus[4][0] * 100).toFixed(0)}
          %)<br/>Arvesse on võetud teksti, sõnade ja lausete pikkus.</p>
        <p style={{width: "100%"}}><b>Morfoloogia ehk vormikasutus: <br/>{this.state.tasemevastus[8][1]} </b>
          (tõenäosus {(this.state.tasemevastus[8][0] * 100).toFixed(0)}%)<br/>Arvesse on võetud sõnaliikide ja
          muutevormide osakaalud ning sõnade vormirohkus.)</p>

        <p style={{width: "100%"}}><b>Sõnavara: <br/>{this.state.tasemevastus[12][1]} </b>
          {this.state.tasemevastus[12][0] > 0 &&
            <span>(tõenäosus {(this.state.tasemevastus[12][0] * 100).toFixed(0)} %)<br/></span>}

          Arvesse on võetud sõnavaliku mitmekesisus ja ulatus (unikaalsete sõnade hulk, harvem esineva sõnavara
          osakaal),
          sõnavara tihedus (sisusõnade osakaal) ja nimisõnade abstraktsus.</p>
        <br/>
        <br/>
        <br/>
      </div>
    }
    return <div onClick={() => this.setState({taselisa: true})}>Loe täpsemalt ...</div>
  }
  state;

  ketas() {
    return <div
      style={{
        borderStyle: "solid", borderRadius: "50%", width: "10px", height: "10px",
        borderTopColor: "transparent", animation: "spin .8s linear infinite",
        float: "left", content: "  "
      }}></div>
  }

  renderTase() {
    return <span>{this.state.kordab ? <span>{this.state.alasisu.length > 0 ?
      (this.state.tasemevastus.length > 0 ?
        (this.state.tasemevastus.length === 1 ? "" : <div style={{float: 'left', width: '95%'}}>
          <h1>{this.state.tasemevastus[0][1]} {(this.state.tasemevastus[0][0] * 100).toFixed(0)}%</h1>
          Muude tasemete tõenäosus: <br/>
          <ul>
            {this.state.tasemevastus.slice(1, 4).map((vastus) =>
              <li key={vastus[1]}>{vastus[1] + " - " + (vastus[0] * 100).toFixed(0)}%</li>
            )}
          </ul>

          {this.renderTasemed()}
        </div>) : <div>Tekst liiga lühike</div>) : ""}</span> : "Tekst on liiga lühike"}</span>
  }

  kerimine() {
    this.taust1.scrollTop = this.ala1.scrollTop;
  }

  tekstialaHiir() {
    let koht = this.ala1.selectionStart;
    let algus = koht;
    let ots = koht;
    while (algus > 0 && this.state.alasisu[algus] !== ' ') {
      algus--;
    }
    while (ots < this.state.alasisu.length && this.state.alasisu[ots] !== ' ') {
      ots++;
    }
    let sona = this.state.alasisu.substring(algus + 1, ots);
    this.vali(sona, this.ala1.selectionStart);
  }

  vali(sona, koht) {
    let k = 0, v = -1;
    while (this.state.sisukohad[k] < koht) {
      k++;
    }
    if (this.state.sisusonad[k] === sona) {
      v = k;
    }
    for (let i = 0; i < 3; i++) {
      if (this.state.sisusonad[k + i] === sona) {
        v = k + i;
      }
      if (this.state.sisusonad[k - i] === sona) {
        v = k - i;
      }
    }
    if (this.state.sisusonad[v] !== this.state.vastussonad[v]) {
      let vahetus = <span key={"sm" + v}>
      <span
        style={{'backgroundColor': 'lightpink'}}>{this.puhasta(this.state.sisusonad[v])}</span> - <span>{this.puhasta(this.state.vastussonad[v])}</span> <button
        onClick={() => this.asenda(this.state.sisukohad[v] - this.state.sisusonad[v].length, this.state.sisusonad[v], this.state.vastussonad[v])}>asenda</button><br/>
   </span>
      this.setState({yksikmuutus: vahetus});
    } else {
      this.setState({yksikmuutus: false});
    }
  }

  //upload text to alasisu
  sendTextFromFile(data) {
    this.setState({alasisu: data}, function () {
      this.keepHistory();
    });
  }

  //history for undo and redo
  //called by alaMuutus when a change is made
  keepHistory() {
    currentHistory += 1
    history.push(this.state.alasisu)
  }

  //undo and redo
  handleUndo() {
    if (currentHistory === 0) {
      return;
    }
    currentHistory -= 1
    const previousFromHistory = history[currentHistory]
    this.setState({alasisu: previousFromHistory})
  }

  handleRedo() {
    //if on last change then nothing to redo
    if (currentHistory === history.length - 1) {
      return;
    }
    currentHistory += 1
    const nextFromHistory = history[currentHistory]
    this.setState({alasisu: nextFromHistory})
  }

  render() {
    return (
      <Card raised={true}
            square={true}
            elevation={2}>
        <p/>
        <div style={{'float': 'left', 'margin': '10px', 'width': '45%'}}>
          <div style={{'float': 'left'}}>
            <TextUpload sendTextFromFile={this.sendTextFromFile}/>
          </div>

          <div style={{'float': 'right'}}>
            <span className="material-symbols-outlined"
                  onClick={this.handleUndo}>undo</span>
            <span className="material-symbols-outlined"
                  onClick={this.handleRedo}>redo</span>
          </div>
          <br/><br/>
          <div className="wrapper">
            <div id="highlights"
                 ref={(e) => this.taust1 = e}>{this.state.taustakood}</div>
            <textarea id="textarea"
                      onScroll={() => this.kerimine()}
                      ref={(e) => this.ala1 = e}
                      onChange={(event) => this.alaMuutus(event)}
                      rows="15"
                      cols="60"
                      value={this.state.alasisu}
                      spellCheck={false}
                      onMouseUp={(event) => this.tekstialaHiir(event)}
                      placeholder={"Kopeeri või kirjuta siia analüüsitav tekst"}

            />
            <div className={"borderbox"}></div>
          </div>
          <br/>

          <br/>
          <div style={{width: "300px"}}>Rakenduse abil saad parandada oma teksti õigekirja ja vaadata,
            mis keeleoskustasemele see vastab (A2–C1).
            Loe lähemalt <a href={"https://github.com/centre-for-educational-technology/evkk/wiki/Demos"}>siit</a>.
          </div>
          <br/>
          <br/>
          <br/>
        </div>
        <div style={{'float': 'left', 'margin': '10px', 'width': '50%', 'height': '500px',}}>
          <style>{`
             @keyframes spin{
                  from {transform:rotate(0deg);}
                  to {transform:rotate(360deg);}
                  }
                  `}
          </style>
          <nav className="navbar navbar-expand-sm bg-light">
            <ul className={"nav nav-tabs nav-justified"}
                style={{width: "100%"}}>
              <li className={"nav-item nav-link"}
                  onClick={() => this.korrektuuriVajutus()}
                  style={this.state.avatudkaart === "korrektuur" ? {fontWeight: "bold"} : {}}
              >Eksimused
              </li>
              <li className={"nav-item nav-link"}
                  onClick={() => this.hindajaVajutus()}
                  style={this.state.avatudkaart === "hindamine" ? {fontWeight: "bold"} : {}}
              >Tasemehinnang
              </li>
              <li className={"nav-item nav-link"}
                  onClick={() => this.keerukusVajutus()}
                  style={this.state.avatudkaart === "keerukus" ? {fontWeight: "bold"} : {}}
              >Keerukus
              </li>
              <li className={"nav-item nav-link"}
                  onClick={() => this.mitmekesisusVajutus()}
                  style={this.state.avatudkaart === "mitmekesisus" ? {fontWeight: "bold"} : {}}
              >Mitmekesisus
              </li>
            </ul>
          </nav>

          {!this.state.kordab &&
            <div><br/> <br/><br/> <br/>
              <div style={{width: "100%", textAlign: "center", height: 500}}>
                <Button style={{'fontSize': '20px'}}
                        sx={{width: 200}}
                        variant="contained"
                        onClick={() => this.kordama()}>Analüüsi</Button>
              </div>
            </div>
          }
          <br/>
          <br/>
          {this.state.avatudkaart === "korrektuur" && this.state.kordab && this.state.paringlopetatud &&
          this.state.muutuskood.props.children === "puuduvad" ?
            <span>
                 <div style={{'float': 'left', 'margin': '10px', 'width': '50%'}}>
                   <h3>Kõik on õige</h3>
                 </div>
               </span>
            :
            <span>
             {this.state.kordab && this.state.alasisu !== this.state.korrektorivastus[1] && this.ketas()}<br/>
              {(this.state.yksikmuutus) ? this.state.yksikmuutus : ""
              }<br/>
              {this.state.vastusnahtav && <span>{this.state.tasemevastus ? this.state.vastuskood : "algus"}</span>}
             </span>
          }


          {this.state.avatudkaart === "hindamine" && this.state.kordab && <div>
            {(this.state.alasisu !== this.state.tasemetekst) ? this.ketas() : ""} <br/>
            <span>{this.renderTase()}</span></div>}

          {this.state.avatudkaart === "keerukus" && this.state.kordab && this.state.keerukusvastus[0] > 0 &&
            <div>Keerukuse andmed <br/>

              <table>
                <tbody>
                <tr>
                  <td>Lauseid</td>
                  <td>&nbsp;&nbsp;</td>
                  <td>{this.state.keerukusvastus[0]}</td>
                </tr>
                <tr>
                  <td>Sõnu</td>
                  <td>&nbsp;</td>
                  <td>{this.state.keerukusvastus[1]}</td>
                </tr>
                <tr>
                  <td>Paljusilbilisi sõnu</td>
                  <td>&nbsp;</td>
                  <td>{this.state.keerukusvastus[2]}</td>
                </tr>
                <tr>
                  <td>Silpe</td>
                  <td>&nbsp;</td>
                  <td>{this.state.keerukusvastus[3]}</td>
                </tr>
                <tr>
                  <td>Pikki sõnu</td>
                  <td>&nbsp;</td>
                  <td>{this.state.keerukusvastus[4]}</td>
                </tr>
                </tbody>
              </table>
              <br/><br/>
              Indeksid<br/>
              <table>
                <tbody>
                <tr>
                  <td
                    title="1,0430*√((vähemalt kolmesilbilisi sonu*30)/lausete arv)+3,1291  (McLaughlin, 1969)">SMOG
                  </td>
                  <td>&nbsp;</td>
                  <td>{parseFloat(this.state.keerukusvastus[5]).toFixed(2)}</td>
                </tr>
                <tr>
                  <td
                    title="0.39 * (sõnade arv/lausete arv) + 11.8 * (silpide arv/sõnade arv) - 15.59  (Kincaid et al., 1975)">Flesch-Kincaidi
                    indeks
                  </td>
                  <td>&nbsp;</td>
                  <td>{parseFloat(this.state.keerukusvastus[6]).toFixed(2)}</td>
                </tr>
                <tr>
                  <td
                    title="sõnade arv/lausete arv + ((pikkade sõnade arv * 100)/sõnade arv)  (Björnsson, 1968)">LIX
                  </td>
                  <td>&nbsp;</td>
                  <td>{this.state.keerukusvastus[7]}</td>
                </tr>
                </tbody>
              </table>
              <div style={{fontSize: "20px"}}>Pakutav keerukustase: {this.state.keerukusvastus[11]}</div>
            </div>}
          {this.state.avatudkaart === "mitmekesisus" && this.state.kordab && this.state.mitmekesisusvastus[10] > 0 &&
            <div>Sõnavara mitmekesisuse andmed<br/>
              <table>
                <tbody>
                <tr>
                  <td>Sõnu</td>
                  <td>&nbsp;&nbsp;</td>
                  <td>{this.state.mitmekesisusvastus[10]}</td>
                </tr>
                <tr>
                  <td>Lemmasid ehk erinevaid sõnu</td>
                  <td>&nbsp;</td>
                  <td>{this.state.mitmekesisusvastus[11]}</td>
                </tr>
                <tr>
                  <td title="lemmade arv / √(2 * sõnade arv)  (Carroll, 1964)">Korrigeeritud lemmade-sõnade suhtarv -
                    KLSS <br/>(ingl Corrected Type-Token Ratio)
                  </td>
                  <td>&nbsp;</td>
                  <td>{this.state.mitmekesisusvastus[0]}</td>
                </tr>
                <tr>
                  <td title="lemmade arv /  √(sõnade arv)  (Guiraud, 1960)">Juuritud lemmade-sõnade suhtarv -
                    JLSS <br/>(ingl Root Type-Token Ratio)
                  </td>
                  <td>&nbsp;</td>
                  <td>{this.state.mitmekesisusvastus[1]}</td>
                </tr>
                <tr>
                  <td
                    title="Indeks mõõdab lemmade ja sõnade suhtarvu järjestikustes tekstiosades. Algul on suhtarv 1. Iga sõna juures arvutatakse see uuesti, kuni väärtus langeb alla piirarvu 0,72. Tsükkel kordub, kuni teksti lõpus jagatakse sõnade arv selliste tsüklite arvuga. Seejärel korratakse sama, liikudes tekstis tagantpoolt ettepoole. MTLD on nende kahe teksti keskväärtus. (McCarthy &amp; Jarvis, 2010)">MTLD
                    indeks <br/>(ingl Measure of Textual Lexical Diversity)
                  </td>
                  <td>&nbsp;</td>
                  <td>{this.state.mitmekesisusvastus[4]}</td>
                </tr>
                <tr>
                  <td
                    title="Indeksi arvutamiseks leitakse iga tekstis sisalduva lemma esinemistõenäosus juhuslikus 42-sõnalises tekstiosas. Kuna kõigi võimalike tekstikatkete arv on enamasti väga suur, arvutatakse tõenäosused hüpergeomeetrilise jaotuse funktsiooni abil. Kõigi lemmade esinemistõenäosused summeeritakse. (McCarthy &amp; Jarvis, 2007)">HDD
                    indeks <br/>(ingl Hypergeometric Distribution D)
                  </td>
                  <td>&nbsp;</td>
                  <td>{this.state.mitmekesisusvastus[5]}</td>
                </tr>
                </tbody>
              </table>
              {this.state.mitmekesisusvastus[7] && this.state.mitmekesisusvastus[7] !== "0" &&
                <div style={{fontSize: "20px"}}>Pakutav
                  tase: {this.state.mitmekesisusvastus.slice(7, 10).filter((v, i, a) => a.indexOf(v) === i).join("/")}</div>}
            </div>}
        </div>
      </Card>
    );
  }
}

export default Correction;