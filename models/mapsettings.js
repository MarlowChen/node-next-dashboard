const mapSettings = (sequelize, DataTypes) => {
  const MapSettings = sequelize.define(
    'MapSettings',
    {
      //公開地圖比例
      public_map_zoom: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      //公開地圖經度
      public_map_lat: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      //公開地圖緯度
      public_map_lng: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      //管理版地圖比例
      private_map_zoom: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      //管理版地圖經度
      private_map_lat: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      //管理版地圖緯度
      private_map_lng: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      //天氣地圖位置
      weather_pos: {
        type: DataTypes.STRING
      },
      //地圖名稱
      map_name: {
        type: DataTypes.STRING
      },
      //地圖是否顯示攝影機名稱
      camera_name_view: {
        type: DataTypes.BOOLEAN
      },
      //地圖是否顯示系統時間
      sys_time_view: {
        type: DataTypes.BOOLEAN
      },
    }
  )
  return MapSettings
}

module.exports = mapSettings

