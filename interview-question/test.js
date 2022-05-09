const addTwoNumbers = function(l1, l2) {
    const cache = {}
    const l1Len = l1.length, l2Len = l2.length
    const len = l1Len > l2Len ? l1Len: l2Len
    for(let i=0; i<len; i++) {
        const pre=l1[i]||0, next=l2[i] || 0
        console.log(pre, next, '------next' )
        const total = pre + next
        
        if(Math.floor(total/10)===1) {
            const res = total % 10
            cache[i+1] = 1
            if(cache[i]) {
                const cRes = res + cache[i]
                if(Math.floor(cRes/10) === 1) {
                    cache[i] = cRes % 10
                    cache[i+1] = 1
                }else {
                    cache[i] = res + cache[i]
                }
            }else {
                cache[i] = res
                
            }
            
        }else {
            if(cache[i]) {
                const cRes = total + cache[i]
                if(Math.floor(cRes/10) === 1) {
                    cache[i] = cRes % 10
                    cache[i+1] = 1
                }else {
                    cache[i] = total + cache[i]
                }
            }else {
                cache[i] = total
            }
        }
    }
    cache.length = Object.keys(cache).length
    return Array.from(cache)
};
const l1 = [9,9,9,9,9,9,9], l2 = [9,9,9,9]
const res = addTwoNumbers(l1, l2)

console.log(res,'------------------res')
