import findit from 'findit2'

const directoryFinder = async (directoryName: string) => {
    const path: string = await new Promise((resolve)=> {
        const directory = process.cwd().includes('src') ? process.cwd().substring(0, process.cwd().indexOf("src") + 3) : process.cwd()
        const finder = findit(directory);
        finder.on('directory',function (dir: string,_: any, stop: () => void) {
            if (dir.includes('.git') || dir.includes('node_modules')) stop()
            if(dir.endsWith(directoryName)){
                stop()
                resolve(dir);
            }
        })
       finder.on('end', () => {
        resolve(directory);
       })
    })
    return path;
}

export { directoryFinder }