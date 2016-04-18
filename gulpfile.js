var gulp = require('gulp'),
  browserify = require('browserify'),
  source = require('vinyl-source-stream'),
  buffer = require('vinyl-buffer'),
  sourcemaps = require('gulp-sourcemaps'),
  babelify = require('babelify'),
  msbuild = require('gulp-msbuild'),
  minifyCss = require('gulp-minify-css'),
  uglify = require('gulp-uglify'),
  assemblyInfo = require('gulp-dotnet-assembly-info'),
  plumber = require('gulp-plumber'),
  config = require('./package.json'),
  zip = require('gulp-zip'),
  filter = require('gulp-filter'),
  merge = require('merge2'),
  gutil = require('gulp-util'),
  markdown = require('gulp-markdown'),
  rename = require('gulp-rename'),
  manifest = require('gulp-dnn-manifest'),
  path = require('path'),
  concat = require('gulp-concat'),
  less = require('gulp-less'),
  lessPluginCleanCSS = require('less-plugin-clean-css'),
  cleancss = new lessPluginCleanCSS({
    advanced: true
  });
  
gulp.task('browserify', function() {
  var b = browserify({
    entries: ['js/src/RoleManager.jsx',
              'js/src/Common.js',
              'js/src/RoleManagerService.js'],
    debug: true
  });
  b.transform("babelify", {presets: ["es2015", "react"]});
  b.external('react');
  return b.bundle()
    .on('error', function(err){
      console.log(err.message);
      this.emit('end');
    })
    .pipe(source('rolemanager.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
        // Add transformation tasks to the pipeline here.
        //.pipe(uglify())
        .on('error', gutil.log)
    //.pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./js/'));
});

gulp.task('less', function() {
  return gulp.src('css/src/less/module.less')
    .pipe(less({
      paths: [path.join(__dirname, 'less', 'includes')],
      plugins: [cleancss]
    }))
    .pipe(gulp.dest('.'));
});

gulp.task('copy', function() {
  gulp.src([
      'node_modules/bootstrap/dist/fonts/*.*'
    ])
    .pipe(gulp.dest('fonts'));
  gulp.src([
      'node_modules/bootstrap/dist/css/bootstrap.min.css'
    ])
    .pipe(gulp.dest('css'));
  return gulp.src([
      'node_modules/react/dist/react.min.js',
      'node_modules/react-dom/dist/react-dom.min.js',
      'node_modules/bootstrap/dist/js/bootstrap.min.js'
    ])
    .pipe(gulp.dest('js'));
});

gulp.task('watch', function() {
  gulp.watch('js/src/**/*.js*', ['browserify']);
  gulp.watch('css/src/**/*.less', ['less']);
});

gulp.task('assemblyInfo', function() {
  return gulp
    .src('**/AssemblyInfo.cs')
    .pipe(assemblyInfo({
      title: config.dnnModule.friendlyName,
      description: config.description,
      version: config.version,
      fileVersion: config.version,
      company: config.dnnModule.owner.organization,
      copyright: function(value) {
        return 'Copyright ' + new Date().getFullYear() + ' by ' + config.dnnModule.owner.organization;
      }
    }))
    .pipe(gulp.dest('.'));
});

gulp.task('build', ['assemblyInfo'], function() {
  return gulp.src('./Connect.RoleManager.csproj')
    .pipe(msbuild({
      toolsVersion: 14.0,
      targets: ['Clean', 'Build'],
      errorOnFail: true,
      stdout: true,
      properties: {
        Configuration: 'Release',
        OutputPath: config.dnnModule.pathToAssemblies
      }
    }));
});

gulp.task('packageInstall', ['browserify', 'build'], function() {
  var packageName = config.dnnModule.fullName + '_' + config.version;
  var dirFilter = filter(fileTest);
  return merge(
      merge(
        gulp.src([
          'App_LocalResources/*.resx',
          '*.ascx',
          'Views/**/*.cshtml',
          'fonts/*.*'
        ], {
          base: '.'
        }),
        gulp.src([
          '**/*.html'
        ], {
          base: '.'
        })
        .pipe(dirFilter),
        gulp.src([
          '**/*.png',
          '**/*.gif',
          '**/*.txt'
        ], {
          base: '.'
        })
        .pipe(dirFilter),
        gulp.src(['*.css', 'css/*.css'], {
          base: '.'
        })
        .pipe(minifyCss())
        .pipe(dirFilter),
        gulp.src(['js/*.js', '!js/*.min.js'], {
          base: '.'
        })
        .pipe(uglify().on('error', gutil.log)),
        gulp.src(['js/*.min.js'], {
          base: '.'
        })
      )
      .pipe(zip('Resources.zip')),
      gulp.src(config.dnnModule.pathToSupplementaryFiles + '/*.dnn')
      .pipe(manifest(config)),
      gulp.src([config.dnnModule.pathToAssemblies + '/*.dll',
        config.dnnModule.pathToScripts + '/*.SqlDataProvider',
        config.dnnModule.pathToSupplementaryFiles + '/License.txt',
        config.dnnModule.pathToSupplementaryFiles + '/ReleaseNotes.txt'
      ]),
      gulp.src(config.dnnModule.pathToSupplementaryFiles + '/ReleaseNotes.md')
      .pipe(markdown())
      .pipe(rename('ReleaseNotes.txt'))
    )
    .pipe(zip(packageName + '_Install.zip'))
    .pipe(gulp.dest(config.dnnModule.packagesPath));
});

gulp.task('packageSource', ['browserify', 'build'], function() {
  var packageName = config.dnnModule.fullName + '_' + config.version;
  var dirFilter = filter(fileTest);
  return merge(
      gulp.src(['**/*.html',
        '**/*.png',
        '**/*.gif',
        '**/*.css',
        'js/**/*.js',
        '**/*.??proj',
        '**/*.sln',
        '**/*.json',
        '**/*.cs',
        '**/*.vb',
        '**/*.resx',
        '**/*.ascx',
        '**/*.cshtml',
        '**/*.less',
        'fonts/*.*',
        config.dnnModule.pathToSupplementaryFiles + '**/*.*'
      ], {
        base: '.'
      })
      .pipe(dirFilter)
      .pipe(zip('Resources.zip')),
      gulp.src(config.dnnModule.pathToSupplementaryFiles + '/*.dnn')
      .pipe(manifest(config)),
      gulp.src([config.dnnModule.pathToAssemblies + '/*.dll',
        config.dnnModule.pathToScripts + '/*.SqlDataProvider',
        config.dnnModule.pathToSupplementaryFiles + '/License.txt',
        config.dnnModule.pathToSupplementaryFiles + '/ReleaseNotes.txt'
      ])
    )
    .pipe(zip(packageName + '_Source.zip'))
    .pipe(gulp.dest(config.dnnModule.packagesPath));
})

gulp.task('package', ['packageInstall', 'packageSource'], function() {
  return null;
})

function fileTest(file) {
  var res = false;
  for (var i = config.dnnModule.excludeFilter.length - 1; i >= 0; i--) {
    res = res | file.relative.startsWith(config.dnnModule.excludeFilter[i]) | file.relative.indexOf('/obj/') > -1;
  };
  return !res;
}

function startsWith(str, strToSearch) {
  return str.indexOf(strToSearch) === 0;
}