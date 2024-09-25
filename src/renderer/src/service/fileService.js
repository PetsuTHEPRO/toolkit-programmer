import fs from 'fs'

export default{
    renameFile(oldPath, newPath){[
        fs.rename(oldPath, newPath, (err) => {
            if (err) {
                console.log(err)
            }
            console.log('Arquivo renomeado com sucesso!')
        })
    ]}
}