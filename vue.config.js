const webpack=require('webpack')
module.exports = {
    // 选项...
    configureWebpack:{
        plugins:[
            new webpack.ProvidePlugin({
                $: "jquery",
                jQuery: "jquery",
                jquery: "jquery",
                "window.jQuery": "jquery"
            })
        ]
    },
    devServer:{
        port:80,
        proxy:{
            '/api':{
                target:'http://localhost:8080/',
                changeOrigin:true
            }
        }
    }
  }