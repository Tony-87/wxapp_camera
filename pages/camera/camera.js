// pages/camera/camera.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // src:'./img2.jpg',
    lastData:{},
    color: "rgba(255,255,255,1)" 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    setTimeout(()=>{
      setInterval(this.checkColor, 500)
      // this.checkColor()
    },2000)

  },

  addImg(){
    var ctx = wx.createCanvasContext('secondCanvas')
    
    ctx.drawImage(this.src, 0, 0, 375, 300)
    ctx.draw()
  },
  takeColor() {
    this.checkColor()
  },
  checkColor() {
    var ctx = wx.createCanvasContext('secondCanvas')
 
    const ctxCamera = wx.createCameraContext()
    console.log(new Date().getTime(),'checkColor')
    ctxCamera.takePhoto({
      quality: 'high',
      success: (res) => {
        
        ctx.drawImage(res.tempImagePath, 0, 0, 375, 300)
        ctx.draw()
        console.log(new Date().getTime(),'draw Image')
        // console.log('draw second', res.tempImagePath)
       
          setTimeout(() => {
          this.getImageFromCanvas()
        }, 15)
          // this.getImageFromCanvas()
        
      }
    })

  //  setTimeout(() => {
  //         this.getImageFromCanvas()
  //       }, 100)

   
  



  },


  getImageFromCanvas(){
    var me = this
    console.log(new Date().getTime(),'begin get image')
    wx.canvasGetImageData({
      canvasId: 'secondCanvas',
      x: 0,
      y: 0,
      width: 375,
      height: 300,
      success(res) {
        console.log(new Date().getTime(),'get image')
        // console.log(res.width) // 100
        // console.log(res.height) // 100
        // console.log(res.data instanceof Uint8ClampedArray) // true
        console.log(res.data.length) // 100 * 100 * 4
        
        if(res.data.slice(0,10).join()!='0000000000')
        {
          me.lastData = res
          me.calcMainColor(res)
        }
        else
        {
          me.calcMainColor(me.lastData)
        }

        

        // var imgData = res.data
        // var pxCount = imgData.length;
       

        // console.log( imgData.slice(0,20).join(','))
        // console.log(imgData[0], imgData[1], imgData[2], imgData[3])


        // for (var i = 0; i < pxCount/9; i += 4) {
        //   var colorR = imgData[i]
        //   var colorG = imgData[i + 1]
        //   var colorB = imgData[i + 2]
        //   var colorA = imgData[i + 3]

        //   var pxColor = colorR + '-' + colorG + '-' + colorB;
        //   // console.log(pxColor)

        // }
      }
    })
  },

  calcMainColor(imgInfo){
    var imgData = imgInfo.data;
    var height = imgInfo.height;
    var pxCount = imgData.length;
    var lineStep = pxCount / height
    var resultObj = {}, resultArr = []
    for (var line = 0; line < height; line++) {
      if (line % 3 == 1) {
        var lineStartIndex = line * lineStep

        for (var i = lineStartIndex + 4; i < lineStartIndex + lineStep; i += 12) {
          // var colorR = Math.floor(parseInt(imgData[i]) / 10)
          // var colorG = Math.floor(parseInt(imgData[i+1]) / 10)
          // var colorB = Math.floor(parseInt(imgData[i+2])/10)
          
          var colorR = imgData[i]
          var colorG = imgData[i + 1]
          var colorB = imgData[i + 2]
          var colorA = imgData[i + 3]
          var pxColor = colorR + '-' + colorG + '-' + colorB;
          if (!resultObj[pxColor]) {
            resultObj[pxColor] = 0
          }
          resultObj[pxColor]++
        }

      }
    }

    for (var para in resultObj) {
      resultArr.push({ color: para, count: resultObj[para] })
    }
    resultArr.sort(function (a, b) { return b.count - a.count })

    var colorArr =resultArr[0].color.split('-')

    console.log(colorArr)
    this.setData({
      color: "rgba(" + colorArr[0] + "," + colorArr[1] + "," + colorArr[2] +",1)"
    })
    console.log(resultArr)

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  takeCube() {

  },
  take3D() { },
  takeAR() {
    var context = wx.createCanvasContext('firstCanvas')

    context.setStrokeStyle("#00ff00")
    context.setLineWidth(5)
    context.rect(0, 0, 200, 200)
    context.stroke()
    context.setStrokeStyle("#ff0000")
    context.setLineWidth(2)
    context.moveTo(160, 100)
    context.arc(100, 100, 60, 0, 2 * Math.PI, true)
    context.moveTo(140, 100)
    context.arc(100, 100, 40, 0, Math.PI, false)
    context.moveTo(85, 80)
    context.arc(80, 80, 5, 0, 2 * Math.PI, true)
    context.moveTo(125, 80)
    context.arc(120, 80, 5, 0, 2 * Math.PI, true)
    context.stroke()
    context.draw()

  },
  takePhoto() {
    const ctx = wx.createCameraContext()
    ctx.takePhoto({
      quality: 'high',
      success: (res) => {
        this.setData({
          src: res.tempImagePath
        })
      }
    })
  },
  error(e) {
    console.log(e.detail)
  }

})