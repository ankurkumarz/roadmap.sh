const fs = require('fs');
const path = require('path');

const roadmapsDir = path.join(__dirname, '../roadmaps');
const roadmapsDirNames = fs.readdirSync(roadmapsDir);

// Returns an array of objects
// [
//    {
//        filePath: '',
//        content: '## markdwon',
//    }
// ]
function listContentFiles(dirPath, pagesList) {
  if (!fs.existsSync(dirPath)) {
    return pagesList;
  }

  fs.readdirSync(dirPath).forEach((dirChildName) => {
    const dirChildFullPath = path.join(dirPath, dirChildName);

    // For directories, find the nested children pages
    if (fs.lstatSync(dirChildFullPath).isDirectory()) {
      pagesList = listContentFiles(dirChildFullPath, pagesList);
    } else {
      pagesList.push({
        filePath: dirChildFullPath,
        content: fs.readFileSync(dirChildFullPath, 'utf-8'),
      });
    }
  });

  return pagesList;
}

const content = {};

roadmapsDirNames.forEach((roadmapDirName) => {
  const roadmapContentDirPath = path.join(
    roadmapsDir,
    roadmapDirName,
    'content'
  );

  content[roadmapDirName] = listContentFiles(roadmapContentDirPath, []).map(
    (contentFile) => {
      const permalink = contentFile.filePath
        .replace(roadmapContentDirPath, '') // e.g. `/Users/kamran/projects/dev-roadmap/src/roadmaps/frontend` will become `/frontend`
        .replace('/index.md', '') // e.g. `/frontend/css/index.md` will become `/frontend/css/`
        .replace('.md', ''); // e.g. `/frontend/css/tailwind.md` will become `/frontend/css/tailwind/`

      return {
        ...contentFile,
        permalink: path
          .join('/', roadmapDirName, permalink, '/')
          .replaceAll(/\/\d+-/g, '/'),
      };
    }
  );
});

module.exports = content;
