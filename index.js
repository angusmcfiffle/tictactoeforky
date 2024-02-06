const grid = Array.from(document.querySelectorAll('#grid div'));
let playerMarks = [];
let aiMarks= [];
let streakCode = null;

grid.forEach((div, index) => {
    div.onclick = () => {
        mark(index, 'X');
        aiMark(playerMarks);
    }
})

function mark(n, str) {
    grid[n].onclick = '';
    grid[n].innerHTML = str;
    if(str === 'X') {
        playerMarks.push(n);
        if(streakCheck(playerMarks)) newGame(0);
        return
    }
    aiMarks.push(n);
    if(streakCheck(aiMarks)) newGame(1);
}

function streakCheck(arr) {
    if( arr.length < 3) return

    let value = false;
    arr.forEach(n => {
        if( n==0 || n==3 || n==6) {
            if(arr.some(x => x==n+1) && arr.some(x => x == n+2)) {
                streakCode = [n, n+1, n+2];
                value = true;
                return
            }
        }
        if( n==0) {
            if(arr.some(x => x==n+4) && arr.some(x => x == n+8)) {
                streakCode = [n, n+4, n+8];
                value = true;
                return
            }
        }
        if( n==2) {
            if(arr.some(x => x==n+2) && arr.some(x => x == n+4)) {
                streakCode = [n, n+2, n+4];
                value = true;
                return
            }
        }
        if( n==0 || n==1 || n==2) {
            if(arr.some(x => x==n+3) && arr.some(x => x == n+6)) {
                streakCode = [n, n+3, n+6];
                value = true;
                return
            }
        }
    })
    return value
}

function streakFill(arr) {
    arr.forEach(i => grid[i].style.color = 'red')
}

function aiMark(arr) {
    if(arr.length === 1) return mark( arr[0] !== 4 ? 4 : 0 ,'O'); // ai first move preference
    let pTemp = null;
    let i = 0;
    let pAiMarks = [...playerMarks]
    pAiMarks.push(aiMarks)
    let pAiTemp = null;
    let z = 0;
    let aiTemp = null;
    let o = 0;

    if(aiMarks.length >= 2) { // secures AI win possibilities first
        while(o < 10) {
            if(!arr.some(x => x === o) && !aiMarks.some(x => x === o)) {
                aiTemp = [...aiMarks];
                aiTemp.push(o);
                if(streakCheck(aiTemp)) {
                    mark(o, 'O');
                    o = 10;
                    return
                }
                if(o === 9) aiBlockMark() // if none, block player win possibilities
            }
            o++
        }    
    } else aiBlockMark()
    
    function aiBlockMark() {
        while(i < 10) {
            if(!arr.some(x => x === i) && !aiMarks.some(x => x === i)) {
                pTemp = [...playerMarks];
                pTemp.push(i);
                if(streakCheck(pTemp)) {
                    mark(i, 'O');
                    i = 10;
                    return
                }
                if(i === 9) aiWinMark(); // if there's no player win possibilities, secure ai win marks again
            }
            i++
        }
    }

    function aiWinMark() { // there are 2 secure ai win possibilities call if ever players attempt to block ai wins
        z = 0;
        aiTemp = null;
        o = 0;
        if(aiMarks.length === 1) { // pre-determined 2nd move
            while (z < 10) {
                if(!arr.some(x => x === z) && !aiMarks.some(x => x === z)) {
                    if(z === 9) return aiRndmMark()
                    if(aiMarks[0] == 0 && z%2 === 0) {
                        mark(z, 'O');
                        z = 10;
                        return
                    }
                    if(aiMarks[0] !== 0 && z%2 !== 0) {
                        mark(z, 'O');
                        z = 10;
                        return
                    }
                }
                z++
            }
            return
        }
        while(o < 10) { // if not 2nd move, secure ai win possibilities
            if(!arr.some(x => x === o) && !aiMarks.some(x => x === o)) {
                aiTemp = [...aiMarks];
                aiTemp.push(o);
                if(streakCheck(aiTemp)) {
                    mark(o, 'O');
                    o = 10;
                    return
                }
                if(o === 9) aiRndmMark()
            }
            o++
        }
    }

    function aiRndmMark() { // if overall none, get random
        let w = 0;
        while(w < 10) {
            if(!arr.some(x => x === w) && !aiMarks.some(x => x === w)) {
                if(w === 9) return newGame(2)
                mark(w, 'O');
                w = 10;
                return
            }
            w++
        }
    }
}

function newGame(n) { // alert with alert codes and reset
    if(n !== 2) streakFill(streakCode);
    setTimeout(()=>{
        if(n === 0) alert('You win!')
        if(n === 1) alert("Try again!..")
        if(n === 2) alert("It's a tie!")
        playerMarks = [];
        aiMarks = [];
        streakCode = null;
        grid.forEach((div, index) => {
            div.innerHTML = '';
            div.style.color = 'black';
            div.onclick = () => {
                mark(index, 'X');
                aiMark(playerMarks);
            }
        })
    }, 100)
}
