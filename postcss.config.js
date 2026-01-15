export default {
  plugins: {
    tailwindcss: {},    
    'postcss-rem-to-responsive-pixel': {
      rootValue: 16,        // 1rem = 16px
      propList: ['*'],      // 全プロパティ変換
      transformUnit: 'px',  // px出力
      replace: true,        // remを置き換え
      mediaQuery: true      // メディアクエリ内も変換
    },
    autoprefixer: {}
  }
}
