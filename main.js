/* =============================================
   HackathonCorp — main.js
   ============================================= */


/* ---------- STATE ---------- */

let activeTab = 1
const tabs = document.querySelectorAll(".tab")


/* ---------- TAB FUNCTIONS ---------- */

function setActive(tabIndex){
    activeTab = tabIndex
    tabs.forEach(tab => tab.classList.remove("active"))
    document.querySelector('.tab[data-tab="'+tabIndex+'"]').classList.add("active")
    document.querySelectorAll(".panel").forEach(p => p.classList.remove("active"))
    document.getElementById("panel"+tabIndex).classList.add("active")

    // start game when entering panel 6
    if(tabIndex === 6){ gameStart() }
}

tabs.forEach(tab=>{
    const index = Number(tab.dataset.tab)
    tab.addEventListener("click",()=>{ setActive(index) })
})


/* ---------- CAROUSEL ---------- */

const track = document.getElementById("carouselTrack")
const dotsContainer = document.getElementById("carouselDots")
const slides = track.querySelectorAll(".carousel-slide")
const total = slides.length

let current = 0
let autoTimer = null

slides.forEach((_,i)=>{
    const dot = document.createElement("div")
    dot.className = "dot" + (i===0?" active":"")
    dot.addEventListener("click",()=>goTo(i))
    dotsContainer.appendChild(dot)
})

function goTo(index){
    current = (index + total) % total
    track.style.transform = "translateX(-"+current*100+"%)"
    dotsContainer.querySelectorAll(".dot").forEach((d,i)=>{
        d.classList.toggle("active", i===current)
    })
    resetAuto()
}

function resetAuto(){
    clearInterval(autoTimer)
    autoTimer = setInterval(()=>goTo(current+1), 4500)
}

document.getElementById("prevBtn").addEventListener("click",()=>goTo(current-1))
document.getElementById("nextBtn").addEventListener("click",()=>goTo(current+1))

resetAuto()


/* ---------- ABOUT SIDEBAR ---------- */

const aboutNavItems = document.querySelectorAll(".about-nav-item")
let aboutHoverTimer = null
const aboutHoverDelay = 500

function setAboutActive(index){
    aboutNavItems.forEach(n => n.classList.remove("active"))
    document.querySelectorAll(".about-section").forEach(s => s.classList.remove("active"))
    document.querySelector('.about-nav-item[data-about="'+index+'"]').classList.add("active")
    document.getElementById("about"+index).classList.add("active")
}

aboutNavItems.forEach(item => {
    const index = Number(item.dataset.about)

    item.addEventListener("mouseenter", () => {
        clearTimeout(aboutHoverTimer)
        aboutHoverTimer = setTimeout(() => { setAboutActive(index) }, aboutHoverDelay)
    })

    item.addEventListener("mouseleave", () => {
        clearTimeout(aboutHoverTimer)
    })

    item.addEventListener("click", () => {
        clearTimeout(aboutHoverTimer)
        setAboutActive(index)
    })
})


/* ---------- SERVICES PAGE ---------- */

const svcData = {
    hackathon: {
        city:       { price: "¢500 / event",          tags: ["Local", "In-Person", "Beginner-Friendly"],      desc: "Our City-tier Hackathon package brings the energy of competitive innovation to your neighbourhood. Over 24 to 48 hours, teams of local builders, designers, and problem-solvers converge to tackle challenges set by community sponsors. We handle venue coordination, judging panels, catering, and prize logistics. Ideal for city councils, universities, and local tech communities looking to ignite grassroots talent without the overhead of a large-scale production. Every great empire started somewhere small." },
        country:    { price: "₹4,200 / event",         tags: ["National", "Hybrid", "Mid-Scale"],             desc: "The Country tier expands the competitive arena to a national level, opening participation to teams across every region, time zone, and language group within a single sovereign territory. We provide remote participation infrastructure, multilingual support, and a curated panel of national industry judges. Sponsorship matchmaking, livestreaming, and post-event talent placement services are all included. This is where national champions are forged and careers begin to take flight." },
        planet:     { price: "₿0.8 / event",           tags: ["Planetary", "Flagship", "Televised"],          desc: "Our Planetary Hackathon is the premier innovation event on any given world. Broadcast across all major networks, streamed to billions, and judged by a council of industry titans and elected officials, this is not merely a competition — it is a civilisational moment. Teams from every continent, culture, and climate compete across five simultaneous tracks. Winners receive funding, patents, and a direct audience with planetary leadership. We have run seventeen of these. All seventeen changed something." },
        galaxy:     { price: "∞cr / event",            tags: ["Galactic", "Multi-Species", "Legendary"],      desc: "When a single planet is not enough, you call for a Galactic Hackathon. Participants travel from across star systems — or beam in via quantum uplink — to compete on challenges that affect entire stellar neighbourhoods. Translation matrices, multi-gravity workspaces, and species-sensitive judging criteria are all standard. Past winners have solved warp fuel inefficiency, arbitrated trade disputes, and once accidentally created a new form of music that became the most listened-to genre in three galaxies." },
        universe:   { price: "\u2205 (priceless)",     tags: ["Universal", "Once Per Epoch", "Mythic"],       desc: "The Universal Hackathon occurs once per cosmic epoch, convened only when a problem exists that no single civilisation can solve alone. Participants are selected by recommendation of their respective universal councils. The event spans multiple dimensions simultaneously and has no fixed duration — it ends when the solution is found. HackathonCorp serves as the neutral host and arbitrator. We do not advertise this tier. If you are reading this, you may already be registered." },
        multiverse: { price: "\u2205 (your existence)",tags: ["DANGER", "Irreversible", "Final Tier"],        desc: "WARNING: If you fail this hackathon, your universe will be erased." }
    },
    forensics: {
        city:       { price: "₡800 / case",            tags: ["Local", "Civil", "Fast Turnaround"],           desc: "City-level Forensics covers incident investigation, digital evidence collection, and chain-of-custody documentation for municipal disputes, minor cybercrime, and corporate misconduct at the local scale. Our analysts embed with your team within 24 hours. Reports are court-admissible and delivered with plain-language summaries suitable for non-technical stakeholders. Whether it is a compromised payroll system or a suspicious file deletion, we treat every case with the precision it deserves. No case is too small to matter." },
        country:    { price: "₡12,000 / case",         tags: ["National", "Regulatory", "Classified"],        desc: "Country-tier Forensics engages our senior investigation units for cases involving national infrastructure, cross-jurisdictional data breaches, and regulatory non-compliance at scale. We work alongside government agencies, law enforcement, and legal counsel to build airtight evidentiary records. Our analysts hold clearances across 47 national frameworks. Deliverables include full forensic chain reports, expert witness briefings, and remediation roadmaps. Discretion, accuracy, and speed are the three principles we never compromise." },
        planet:     { price: "₡450k / case",           tags: ["Planetary", "State-Level", "Sensitive"],       desc: "Planetary Forensics is reserved for incidents that threaten systemic stability — election interference, coordinated infrastructure attacks, planetary-scale data exfiltration, or the compromise of critical life-support networks. Our teams operate in isolated environments with air-gapped tooling. All personnel are vetted to the highest planetary security tier. We do not subcontract. We do not outsource. We have resolved eleven planetary-scale incidents. The public knows about two of them. The others were handled the way they needed to be." },
        galaxy:     { price: "∞cr / case",             tags: ["Galactic", "Inter-Agency", "Eyes Only"],       desc: "Galactic Forensics investigates incidents that span multiple star systems, involve non-terrestrial threat actors, or require evidence collection from environments hostile to organic life. We deploy autonomous forensic drones, maintain quantum-encrypted evidence vaults, and coordinate across galactic law enforcement bodies. Cases at this tier often carry civilisational implications. Our analysts do not speculate. They reconstruct. Every conclusion we present is supported by reproducible, peer-reviewed methodology." },
        universe:   { price: "\u2205 (negotiated)",    tags: ["Universal", "Reality-Tier", "Redacted"],       desc: "Universal Forensics addresses incidents in which causality itself may have been tampered with. Timeline inconsistencies, paradox signatures, and cross-dimensional evidence contamination are all within scope. Our reality-tier analysts are trained in temporal chain-of-custody protocols and work under conditions that most investigators cannot perceive. Findings are filed in the Multiversal Archive and are accessible only by court order from a panel of three or more universal magistrates. We have closed four such cases. The details remain sealed." },
        multiverse: { price: "\u2205 (your existence)",tags: ["DANGER", "Irreversible", "Final Tier"],        desc: "WARNING: If you fail this hackathon, your universe will be erased." }
    },
    hacking: {
        city:       { price: "₡1,200 / engagement",   tags: ["Local", "Ethical", "Red Team"],                desc: "City-tier Hacking engagements deploy our ethical penetration testing specialists against local business networks, municipal systems, and small-to-medium infrastructure targets. We simulate real-world attack scenarios — phishing campaigns, physical intrusion attempts, social engineering — then debrief your team with a full findings report and a prioritised remediation checklist. Our red teamers think exactly like threat actors because several of them used to be. They chose the other side. Mostly." },
        country:    { price: "₡85,000 / engagement",  tags: ["National", "Advanced Persistent", "Cleared"],  desc: "Country-level engagements target critical national infrastructure, financial sector resilience, and government network hardness. Our teams operate under strict legal frameworks negotiated with national cyber authorities. We conduct multi-vector campaigns over extended timeframes to simulate advanced persistent threat behaviour. Results are briefed directly to CISOs, ministers, or security committees. Every finding comes with a severity rating, an exploit walkthrough, and a remediation pathway your internal team can action immediately." },
        planet:     { price: "₡2.1M / engagement",    tags: ["Planetary", "Full Spectrum", "Compartmentalised"], desc: "Planetary Hacking engagements test the resilience of an entire world's interconnected systems — energy grids, satellite networks, communications backbone, financial clearing infrastructure, and defence systems — simultaneously. These are the most complex offensive security exercises in existence. Our planetary red teams operate in isolated simulation environments before any live testing begins. Scope is agreed at the highest levels of government. We have never failed to find a critical vulnerability. We have also never disclosed one improperly." },
        galaxy:     { price: "∞cr / engagement",      tags: ["Galactic", "Multi-Vector", "Classified TS"],   desc: "Galactic Hacking engagements probe the security posture of interstellar communication networks, jump-gate authentication systems, trade route encryption, and species-neutral diplomatic channels. Attack surfaces at this scale are measured in light-years. Our galactic red teams use autonomous agents, quantum-entangled command channels, and proprietary zero-day research accumulated across 400 years of operation. The goal is never damage. The goal is always the truth about where you are exposed, before someone less principled finds it first." },
        universe:   { price: "\u2205 (existential)",  tags: ["Universal", "Theoretical", "Forbidden"],      desc: "Universal Hacking is the discipline of identifying vulnerabilities in the fundamental systems that govern reality — physics constants, dimensional membranes, causality loops, and probabilistic resolution engines. We do not perform live universal engagements. We study them. Our theoretical division publishes findings under controlled conditions to a readership of twelve. If you are enquiring about this service for offensive purposes, we have already notified the relevant authorities. If you are enquiring defensively, you already know how to reach us." },
        multiverse: { price: "\u2205 (your existence)",tags: ["DANGER", "Irreversible", "Final Tier"],       desc: "WARNING: If you fail this hackathon, your universe will be erased." }
    }
}

let svcProduct = null
let svcScope   = null
const svcBar2  = document.getElementById("svcBar2")
const svcInfo  = document.getElementById("svcInfo")

function renderSvcInfo(){
    if(!svcProduct || !svcScope) return
    const d = svcData[svcProduct][svcScope]
    document.getElementById("svcName").textContent  = svcProduct.charAt(0).toUpperCase() + svcProduct.slice(1) + " — " + svcScope.charAt(0).toUpperCase() + svcScope.slice(1)
    document.getElementById("svcPrice").textContent = d.price
    const tagsEl = document.getElementById("svcTags")
    tagsEl.innerHTML = d.tags.map(t => `<span class="svc-tag">${t}</span>`).join("")
    document.getElementById("svcDesc").textContent  = d.desc
    svcInfo.classList.add("visible")
    svcInfo.classList.toggle("multiverse", svcScope === "multiverse")
}

document.querySelectorAll(".svc-product-item").forEach(item => {
    item.addEventListener("click", () => {
        document.querySelectorAll(".svc-product-item").forEach(i => i.classList.remove("active"))
        item.classList.add("active")
        svcProduct = item.dataset.product
        svcBar2.classList.add("open")
        svcScope = null
        document.querySelectorAll(".svc-scope-item").forEach(s => s.classList.remove("active"))
        svcInfo.classList.remove("visible","multiverse")
    })
})

document.querySelectorAll(".svc-scope-item").forEach(item => {
    item.addEventListener("click", () => {
        if(!svcProduct) return
        document.querySelectorAll(".svc-scope-item").forEach(s => s.classList.remove("active"))
        item.classList.add("active")
        svcScope = item.dataset.scope
        renderSvcInfo()
    })
})

document.getElementById("svcPurchaseBtn").addEventListener("click", () => {
    if(!svcProduct || !svcScope) return
    if(svcScope === "multiverse"){
        alert("⚠️ PURCHASE CONFIRMED\n\nYour universe has been staked as collateral.\nGood luck. You will need it.")
    } else {
        alert("Purchase initiated for: " + svcProduct.charAt(0).toUpperCase() + svcProduct.slice(1) + " — " + svcScope.charAt(0).toUpperCase() + svcScope.slice(1) + "\n\nOur team will contact you across the relevant dimensions.")
    }
})


/* ---------- CONTACT FORM ---------- */

document.getElementById("contactSendBtn").addEventListener("click", () => {
    const name    = document.getElementById("cName").value.trim()
    const company = document.getElementById("cCompany").value.trim()
    const email   = document.getElementById("cEmail").value.trim()
    const message = document.getElementById("cMessage").value.trim()

    if(!name || !email || !message){
        alert("Please fill in at least your Name, Email, and Message.")
        return
    }

    alert("Message received, " + name + ".\n\nOur team will reach you at " + email + " within 1–3 business dimensions.")

    document.getElementById("cName").value    = ""
    document.getElementById("cCompany").value = ""
    document.getElementById("cEmail").value   = ""
    document.getElementById("cMessage").value = ""
})


/* ---------- PLANET BACKGROUND FALLBACK ---------- */

;(function(){
    const bg = document.querySelector(".galaxy-bg")
    if(!bg) return
    const urls = [
        "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/The_Solar_System_%28black_background%29.jpg/1280px-The_Solar_System_%28black_background%29.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Saturn_-_High_Resolution%2C_2004.jpg/1280px-Saturn_-_High_Resolution%2C_2004.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Jupiter_and_its_shrunken_Great_Red_Spot.jpg/1280px-Jupiter_and_its_shrunken_Great_Red_Spot.jpg"
    ]
    let tried = 0
    function tryNext(){
        if(tried >= urls.length) return
        const img = new Image()
        img.onload = () => { bg.style.backgroundImage = "url('" + urls[tried] + "')" }
        img.onerror = () => { tried++; tryNext() }
        img.src = urls[tried++]
    }
    tryNext()
})()


/* =============================================
   HIDDEN FUN STUFF — DODGE GAME
   ◉ = circle (player), ■ = blocks (enemies)
   Mouse over block → destroy (+1 score)
   Block touches circle → game over
   Speed = INITIAL_SPEED * 1.01^score
   Diagonal blocks move at 1/sqrt(2) of axis speed
   Direction & interval fully randomised
   Best score: session-only (lost on reload)
   ============================================= */

const INITIAL_SPEED   = 0.6        // px per frame axis  <- ctrl+f INITIAL_SPEED
const INITIAL_FREQ_MS = 600        // ms between spawns at score 0  <- ctrl+f INITIAL_FREQ_MS
// speed     = INITIAL_SPEED   * 1.05^score
// frequency = INITIAL_FREQ_MS / 1.05^score  (interval shrinks as score rises)
const INV_SQRT2       = 1 / Math.sqrt(2)
const COLLIDE_R       = 10         // tight hit radius px

const DIRECTIONS = [
    [ 0, -1, false],  // N
    [ 1, -1, true ],  // NE
    [ 1,  0, false],  // E
    [ 1,  1, true ],  // SE
    [ 0,  1, false],  // S
    [-1,  1, true ],  // SW
    [-1,  0, false],  // W
    [-1, -1, true ],  // NW
]

let gameScore    = 0
let gameBest     = 0   // session best — not persisted
let gameRunning  = false
let gameBlocks   = []
let gameRafId    = null
let spawnTimeout = null   // random-interval timeout chain

const arena     = document.getElementById("gameArena")
const scoreEl   = document.getElementById("gameScore")
const bestEl    = document.getElementById("gameBest")
const overlay   = document.getElementById("gameOverlay")
const overTitle = document.getElementById("gameOverTitle")
const overScore = document.getElementById("gameOverScore")
const retryBtn  = document.getElementById("gameRetryBtn")

function axisSpeed(){
    return INITIAL_SPEED * Math.pow(1.03, gameScore)
}

function randInt(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min
}

// Interval = INITIAL_FREQ_MS / 1.05^score — shrinks as score rises
function spawnInterval(){
    return Math.max(80, INITIAL_FREQ_MS / Math.pow(1.03, gameScore))
}

// Schedule next spawn using current frequency
function scheduleSpawn(){
    if(!gameRunning) return
    const delay = spawnInterval()
    spawnTimeout = setTimeout(() => {
        spawnBlock()
        scheduleSpawn()
    }, delay)
}

function spawnBlock(){
    if(!gameRunning) return

    // pick a random direction from all 8
    const dir    = DIRECTIONS[randInt(0, 7)]
    const [ndx, ndy, isDiag] = dir

    const el = document.createElement("div")
    el.className = "game-block"
    el.textContent = "■"

    // arena is square, so aw === ah; use half-side as radius
    const side = arena.clientWidth      // square side length
    const half = side / 2

    // distance from center to edge along this direction
    // since it's a square: for axis dirs the edge is exactly half
    // for diagonals it's also half (corner distance = half*sqrt(2) but
    // we project along the diagonal unit vector, hitting the corner)
    const t = half   // same for both axis and diagonal in a square!

    const sx = half + ndx * (t + 44)
    const sy = half + ndy * (t + 44)

    el.style.left = sx + "px"
    el.style.top  = sy + "px"

    arena.appendChild(el)
    gameBlocks.push({ el, x: sx, y: sy, dx: -ndx, dy: -ndy, isDiag })

    el.addEventListener("mouseenter", () => {
        if(!gameRunning) return
        destroyBlock(el)
    })
}

function destroyBlock(el){
    const idx = gameBlocks.findIndex(b => b.el === el)
    if(idx === -1) return
    gameBlocks.splice(idx, 1)
    el.classList.add("game-block-pop")
    setTimeout(() => { el.parentNode && el.parentNode.removeChild(el) }, 200)
    gameScore++
    scoreEl.textContent = gameScore
    if(gameScore > gameBest){
        gameBest = gameScore
        bestEl.textContent = gameBest
    }
}

function clearBlocks(){
    gameBlocks.forEach(b => { b.el.parentNode && b.el.parentNode.removeChild(b.el) })
    gameBlocks = []
}

function gameLoop(){
    if(!gameRunning) return

    const side = arena.clientWidth
    const half = side / 2
    const spd  = axisSpeed()

    for(let i = gameBlocks.length - 1; i >= 0; i--){
        const b    = gameBlocks[i]
        const move = b.isDiag ? spd * INV_SQRT2 : spd
        b.x += b.dx * move
        b.y += b.dy * move
        b.el.style.left = b.x + "px"
        b.el.style.top  = b.y + "px"

        const dist = Math.sqrt((b.x - half) ** 2 + (b.y - half) ** 2)
        if(dist < COLLIDE_R + 12){
            gameOver()
            return
        }

        // cull if far past center
        if(dist > side * 1.4){
            b.el.parentNode && b.el.parentNode.removeChild(b.el)
            gameBlocks.splice(i, 1)
        }
    }

    gameRafId = requestAnimationFrame(gameLoop)
}

function gameStart(){
    gameOver_cleanup()
    gameScore   = 0
    scoreEl.textContent = "0"
    overlay.classList.remove("visible")
    gameRunning = true
    scheduleSpawn()
    gameRafId = requestAnimationFrame(gameLoop)
}

function gameOver(){
    gameRunning = false
    cancelAnimationFrame(gameRafId)
    clearTimeout(spawnTimeout)
    if(gameScore > gameBest){
        gameBest = gameScore
        bestEl.textContent = gameBest
    }
    overTitle.textContent = "** GAME OVER **"
    overScore.textContent = "SCORE: " + gameScore + "   BEST: " + gameBest
    overlay.classList.add("visible")
}

function gameOver_cleanup(){
    cancelAnimationFrame(gameRafId)
    clearTimeout(spawnTimeout)
    clearBlocks()
    gameRunning = false
}

retryBtn.addEventListener("click", gameStart)


/* ---------- SQUARE ARENA RESIZE ---------- */

function resizeArena(){
    const wrap  = document.querySelector(".game-arena-wrap")
    const center= document.querySelector(".game-center")
    const bar   = document.querySelector(".game-score-bar")
    if(!wrap || !arena || !bar) return

    const availH = wrap.clientHeight
    const availW = wrap.clientWidth
    const side   = Math.min(availH, availW)

    arena.style.width  = side + "px"
    arena.style.height = side + "px"
    center.style.width = side + "px"
}

const resizeObs = new ResizeObserver(resizeArena)
resizeObs.observe(document.querySelector(".game-arena-wrap") || document.body)
window.addEventListener("resize", resizeArena)
resizeArena()
