import type { Env, Novel } from '../../../shared/types'

const sampleNovels = (): Omit<Novel, 'chapterCount'>[] => [
  {
    id: 'sakura-melody',
    title: '樱花旋律',
    author: '星野梦',
    cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=anime%20light%20novel%20cover%20pink%20sakura%20cherry%20blossom%20girl%20high%20school%20uniform%20romantic%20soft%20lighting&image_size=portrait_4_3',
    description: '在樱花飞舞的春天，转学生凛意外加入了即将废部的轻音乐部。五个性格迥异的少女，因为音乐而相遇，在青春的校园里谱写属于她们的旋律。梦想、友情、懵懂的情愫，如同盛开的樱花般绚烂而短暂。',
    category: 'campus',
    tags: ['校园', '音乐', '青春', '治愈', '百合'],
    wordCount: 280000,
    status: 'ongoing',
    createdAt: '2024-01-15T08:00:00Z',
    updatedAt: '2024-06-20T10:30:00Z',
    volumes: [
      {
        id: 'vol-1',
        title: '第一卷 春之相遇',
        chapters: [
          { id: 'ch-1-1', title: '第一章 樱花树下的转学', wordCount: 8500, updatedAt: '2024-01-15T08:00:00Z' },
          { id: 'ch-1-2', title: '第二章 废弃的音乐教室', wordCount: 7800, updatedAt: '2024-01-18T08:00:00Z' },
          { id: 'ch-1-3', title: '第三章 奇怪的部员们', wordCount: 8200, updatedAt: '2024-01-22T08:00:00Z' },
          { id: 'ch-1-4', title: '第四章 第一首合奏', wordCount: 9100, updatedAt: '2024-01-28T08:00:00Z' },
          { id: 'ch-1-5', title: '第五章 文化祭的目标', wordCount: 8000, updatedAt: '2024-02-05T08:00:00Z' }
        ]
      },
      {
        id: 'vol-2',
        title: '第二卷 夏之乐章',
        chapters: [
          { id: 'ch-2-1', title: '第六章 夏日合宿', wordCount: 10200, updatedAt: '2024-04-10T08:00:00Z' },
          { id: 'ch-2-2', title: '第七章 海边的练习', wordCount: 8700, updatedAt: '2024-05-01T08:00:00Z' },
          { id: 'ch-2-3', title: '第八章 流星与心愿', wordCount: 9500, updatedAt: '2024-06-20T10:30:00Z' }
        ]
      }
    ]
  },
  {
    id: 'reincarnated-mage',
    title: '转生魔法王的异世界生活',
    author: '苍银翼',
    cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=anime%20light%20novel%20cover%20fantasy%20isekai%20mage%20wizard%20magic%20circles%20medieval%20world%20adventure%20golden%20eyes&image_size=portrait_4_3',
    description: '过劳死的程序员雷因转生到了剑与魔法的异世界。凭借前世的编程思维，他将魔法理论解构重构，创造出前所未有的魔法体系。从一个小小的冒险者开始，踏上成为魔法王的道路。',
    category: 'fantasy',
    tags: ['异世界', '魔法', '冒险', '龙傲天', '爽文'],
    wordCount: 1250000,
    status: 'ongoing',
    createdAt: '2023-06-01T00:00:00Z',
    updatedAt: '2024-06-25T14:00:00Z',
    volumes: [
      {
        id: 'vol-1',
        title: '第一卷 冒险者起步',
        chapters: Array.from({ length: 15 }, (_, i) => ({
          id: `ch-1-${i + 1}`,
          title: `第${['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二', '十三', '十四', '十五'][i]}章 ${['转生', '魔法资质', '初入公会', '第一个任务', '哥布林讨伐', '意外收获', '魔法改良', '城镇风波', '贵族小姐', '学院推荐', '入学考试', '魔法理论课', '实战演练', '天才之名', '假期来临'][i]}`,
          wordCount: 9000 + Math.floor(Math.random() * 2000),
          updatedAt: '2023-06-01T00:00:00Z'
        }))
      },
      {
        id: 'vol-2',
        title: '第二卷 学院风云',
        chapters: Array.from({ length: 20 }, (_, i) => ({
          id: `ch-2-${i + 1}`,
          title: `第十六至三十五章 学院篇${i + 1}`,
          wordCount: 9500,
          updatedAt: '2023-09-15T00:00:00Z'
        }))
      },
      {
        id: 'vol-3',
        title: '第三卷 王国动荡',
        chapters: Array.from({ length: 25 }, (_, i) => ({
          id: `ch-3-${i + 1}`,
          title: `第三十六至六十章 王国篇${i + 1}`,
          wordCount: 10000,
          updatedAt: '2024-01-20T00:00:00Z'
        }))
      },
      {
        id: 'vol-4',
        title: '第四卷 龙域征途',
        chapters: Array.from({ length: 12 }, (_, i) => ({
          id: `ch-4-${i + 1}`,
          title: `第六十一至七十二章 龙域篇${i + 1}`,
          wordCount: 11000,
          updatedAt: '2024-06-25T14:00:00Z'
        }))
      }
    ]
  },
  {
    id: 'starlight-cafe',
    title: '星光咖啡馆的奇妙日常',
    author: '月见草',
    cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=anime%20light%20novel%20cover%20cozy%20cafe%20coffee%20shop%20night%20stars%20warm%20lighting%20cute%20waitress%20slice%20of%20life&image_size=portrait_4_3',
    description: '位于城市角落的"星光咖啡馆"只在深夜营业。这里的咖啡能让人看到遗失的记忆，来这里的客人都有着各自的故事。沉默寡言的店长、元气满满的看板娘、神秘的黑猫，共同编织着温暖人心的日常。',
    category: 'daily',
    tags: ['日常', '治愈', '咖啡馆', '温情', '奇幻'],
    wordCount: 420000,
    status: 'completed',
    createdAt: '2022-09-10T00:00:00Z',
    updatedAt: '2024-03-15T20:00:00Z',
    volumes: [
      {
        id: 'vol-1',
        title: '第一卷 春之章',
        chapters: Array.from({ length: 12 }, (_, i) => ({
          id: `ch-s1-${i + 1}`,
          title: `第${i + 1}话 春天的${['第一杯咖啡', '访客', '约定', '花语', '雨声', '猫咪', '绘本', '信笺', '回忆', '味道', '星星', '樱花']}`,
          wordCount: 7500,
          updatedAt: '2022-09-10T00:00:00Z'
        }))
      },
      {
        id: 'vol-2',
        title: '第二卷 夏之章',
        chapters: Array.from({ length: 12 }, (_, i) => ({
          id: `ch-s2-${i + 1}`,
          title: `第${i + 13}话 夏天的${['烟火', '风铃', '向日葵', '暑假', '海风', '祭典', '金鱼', '冰咖啡', '星空', '萤火虫', '彩虹', '约定']}`,
          wordCount: 7800,
          updatedAt: '2023-01-20T00:00:00Z'
        }))
      },
      {
        id: 'vol-3',
        title: '第三卷 秋之章',
        chapters: Array.from({ length: 12 }, (_, i) => ({
          id: `ch-s3-${i + 1}`,
          title: `第${i + 25}话 秋天的${['落叶', '毛衣', '栗子', '满月', '旅途', '音乐', '照片', '感谢', '告别', '重逢', '咖啡杯', '门扉']}`,
          wordCount: 8000,
          updatedAt: '2023-06-15T00:00:00Z'
        }))
      },
      {
        id: 'vol-4',
        title: '第四卷 冬之章',
        chapters: Array.from({ length: 14 }, (_, i) => ({
          id: `ch-s4-${i + 1}`,
          title: `第${i + 37}话 冬天的${['初雪', '暖炉', '围巾', '圣诞', '年末', '新年', '初梦', '礼物', '等待', '奇迹', '灯光', '最后一杯', '黎明', '星光']}`,
          wordCount: 8200,
          updatedAt: '2024-03-15T20:00:00Z'
        }))
      }
    ]
  },
  {
    id: 'detective-luna',
    title: '名侦探露娜的事件簿',
    author: '雾雨莲',
    cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=anime%20light%20novel%20cover%20detective%20mystery%20girl%20magnifying%20glass%20noir%20purple%20atmosphere%20crime%20solving&image_size=portrait_4_3',
    description: '拥有"记忆重现"能力的少女露娜，在看似平静的小镇上解决各种离奇事件。每个案件背后都隐藏着人心的秘密，而她用那双看透真相的眼睛，揭开一个又一个谜团。',
    category: 'mystery',
    tags: ['推理', '悬疑', '超能力', '侦探', '单元剧'],
    wordCount: 680000,
    status: 'ongoing',
    createdAt: '2023-03-20T00:00:00Z',
    updatedAt: '2024-06-22T16:00:00Z',
    volumes: [
      {
        id: 'vol-1',
        title: '第一卷 消失的八音盒',
        chapters: [
          { id: 'ch-d1-1', title: '第一章 转校生侦探', wordCount: 8800, updatedAt: '2023-03-20T00:00:00Z' },
          { id: 'ch-d1-2', title: '第二章 旧校舍的传说', wordCount: 9200, updatedAt: '2023-03-25T00:00:00Z' },
          { id: 'ch-d1-3', title: '第三章 消失的八音盒', wordCount: 10500, updatedAt: '2023-04-01T00:00:00Z' },
          { id: 'ch-d1-4', title: '第四章 真相大白', wordCount: 9800, updatedAt: '2023-04-10T00:00:00Z' }
        ]
      },
      {
        id: 'vol-2',
        title: '第二卷 雨夜幽灵',
        chapters: Array.from({ length: 8 }, (_, i) => ({
          id: `ch-d2-${i + 1}`,
          title: `第${i + 5}章 雨夜幽灵篇${i + 1}`,
          wordCount: 9500,
          updatedAt: '2023-08-20T00:00:00Z'
        }))
      },
      {
        id: 'vol-3',
        title: '第三卷 时空错位',
        chapters: Array.from({ length: 10 }, (_, i) => ({
          id: `ch-d3-${i + 1}`,
          title: `第${i + 13}章 时空错位篇${i + 1}`,
          wordCount: 10000,
          updatedAt: '2024-06-22T16:00:00Z'
        }))
      }
    ]
  },
  {
    id: 'mecha-pilot',
    title: '星际机师',
    author: '银河铁',
    cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=anime%20light%20novel%20cover%20mecha%20robot%20pilot%20space%20sci-fi%20stars%20futuristic%20battle%20neon%20lights&image_size=portrait_4_3',
    description: '公元2345年，人类已扩展至银河系各个角落。少年卡恩意外发现了一台古老的人形机甲"赤霄"，从此卷入星际战争的漩涡。驾驶着这台神秘机甲，他要在宇宙中寻找自己的身世之谜。',
    category: 'scifi',
    tags: ['科幻', '机甲', '太空', '战争', '热血'],
    wordCount: 920000,
    status: 'ongoing',
    createdAt: '2023-08-01T00:00:00Z',
    updatedAt: '2024-06-26T09:00:00Z',
    volumes: [
      {
        id: 'vol-1',
        title: '第一卷 赤霄觉醒',
        chapters: Array.from({ length: 18 }, (_, i) => ({
          id: `ch-m1-${i + 1}`,
          title: `第${i + 1}章 ${i < 10 ? ['废弃卫星', '发现', '启动', '首次启动', '逃生', '追兵', '空间站', '老兵', '训练', '考核'][i] : `成长篇${i - 9}`}`,
          wordCount: 11000,
          updatedAt: '2023-08-01T00:00:00Z'
        }))
      },
      {
        id: 'vol-2',
        title: '第二卷 边境风云',
        chapters: Array.from({ length: 22 }, (_, i) => ({
          id: `ch-m2-${i + 1}`,
          title: `第${i + 19}章 边境篇${i + 1}`,
          wordCount: 12000,
          updatedAt: '2024-02-10T00:00:00Z'
        }))
      },
      {
        id: 'vol-3',
        title: '第三卷 帝国阴影',
        chapters: Array.from({ length: 8 }, (_, i) => ({
          id: `ch-m3-${i + 1}`,
          title: `第${i + 41}章 帝国篇${i + 1}`,
          wordCount: 12500,
          updatedAt: '2024-06-26T09:00:00Z'
        }))
      }
    ]
  },
  {
    id: 'love-flag',
    title: '请不要给我插恋爱旗！',
    author: '砂糖雪',
    cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=anime%20light%20novel%20cover%20romantic%20comedy%20harem%20school%20cute%20girls%20heart%20symbols%20pink%20pastel&image_size=portrait_4_3',
    description: '普通高中生柏木悠太拥有一项特殊能力——他能看到别人头顶上的"恋爱旗帜"。为了过上平稳的校园生活，他拼命避免触发任何flag，但转学生的到来彻底打破了他的计划。这是一部关于恋爱flag的喜剧日常！',
    category: 'romance',
    tags: ['恋爱喜剧', '校园', '后宫', '搞笑', '日常'],
    wordCount: 560000,
    status: 'ongoing',
    createdAt: '2023-11-05T00:00:00Z',
    updatedAt: '2024-06-24T18:00:00Z',
    volumes: [
      {
        id: 'vol-1',
        title: '第一卷 转学生是flag毁灭者',
        chapters: Array.from({ length: 10 }, (_, i) => ({
          id: `ch-l1-${i + 1}`,
          title: `第${i + 1}章 ${['能力觉醒', '转学生', '天台告白？', '午餐战争', '社团邀请', 'flag大爆发', '女仆咖啡厅', '夏日祭', '烟花下', '新的flag']}`,
          wordCount: 8500,
          updatedAt: '2023-11-05T00:00:00Z'
        }))
      },
      {
        id: 'vol-2',
        title: '第二卷 修学旅行的混乱',
        chapters: Array.from({ length: 12 }, (_, i) => ({
          id: `ch-l2-${i + 1}`,
          title: `第${i + 11}章 修学旅行篇${i + 1}`,
          wordCount: 9000,
          updatedAt: '2024-03-20T00:00:00Z'
        }))
      },
      {
        id: 'vol-3',
        title: '第三卷 情人节大作战',
        chapters: Array.from({ length: 6 }, (_, i) => ({
          id: `ch-l3-${i + 1}`,
          title: `第${i + 23}章 情人节篇${i + 1}`,
          wordCount: 9200,
          updatedAt: '2024-06-24T18:00:00Z'
        }))
      }
    ]
  }
]

function generateChapterContent(_title: string, chapterTitle: string): string {
  const paragraphs = [
    `${chapterTitle}`,
    '',
    '午后的阳光透过窗户洒进教室，在课桌上投下斑驳的光影。微风拂过，窗帘轻轻摇曳，带来了远处操场上传来的喧闹声。',
    '',
    '"呐，你听说了吗？"同桌的声音突然打断了思绪，"听说今天有转学生会来呢。"',
    '',
    '我抬起头，看向窗外。樱花已经开始飘落，粉色的花瓣在空中打着旋儿，宛如一场温柔的雨。这个季节的转学，总让人觉得有些奇妙。',
    '',
    '"嗯？是吗。"我随口应了一声，目光依然停留在窗外的樱花树上。',
    '',
    '"你怎么一点都不感兴趣啊！"同桌不满地鼓起了腮帮子，"听说还是个美少女呢！"',
    '',
    '我无奈地笑了笑。美少女也好，转学生也好，和我又有什么关系呢？我只是想安稳地度过这平凡的校园生活而已。',
    '',
    '然而，命运总是喜欢在你不经意的时候，悄悄推你一把。',
    '',
    '上课铃响起，班主任走进教室，身后跟着一个身影。那一刻，整个教室仿佛都安静了下来。',
    '',
    '那是一个有着银白色长发的少女，她的眼睛如同清澈的湖水，透着一股不属于这个年纪的沉静。阳光照在她的发梢上，折射出淡淡的光晕。',
    '',
    '"大家好，我叫雪之下冰华。从今天起，将和大家一起学习。请多关照。"',
    '',
    '她的声音清冷悦耳，如同冬日里飘落的第一片雪花。不知为何，当她的目光扫过教室时，我感觉心脏漏跳了一拍。',
    '',
    '更让我没想到的是，班主任指向了我旁边的空位——那是整个教室唯一的空座。',
    '',
    '"雪之下同学，你就坐在柏木同学旁边吧。"',
    '',
    '少女微微颔首，迈步向我走来。一步，两步，她的脚步声在安静的教室里清晰可闻。我的心跳，也随着那脚步声越来越快。',
    '',
    '她在我身旁坐下，身上传来淡淡的清香，像是雪后初晴时空气中那种清冽的味道。',
    '',
    '"请多指教，柏木同学。"她侧过头，对我微微点了点头。',
    '',
    '"啊……请多指教。"我有些慌张地回应道。',
    '',
    '我不知道的是，从这一刻起，我原本以为会平凡度过的校园生活，即将发生翻天覆地的变化。那些我以为只会出现在小说里的情节，正悄然向我走来。',
    '',
    '窗外的樱花依旧在飘落，而属于我们的故事，才刚刚开始。'
  ]
  return paragraphs.join('\n')
}

export async function initSeedData(env: Env): Promise<void> {
  const existingList = await env.NOVEL_META.get('novel:list')
  if (existingList) {
    const list = JSON.parse(existingList) as string[]
    if (list.length > 0) return
  }

  const novels = sampleNovels()
  const novelIds: string[] = []

  for (const novel of novels) {
    const chapterCount = novel.volumes.reduce((sum, v) => sum + v.chapters.length, 0)
    const fullNovel: Novel = { ...novel, chapterCount }

    novelIds.push(novel.id)
    await env.NOVEL_META.put(`novel:${novel.id}`, JSON.stringify(fullNovel))

    for (const volume of novel.volumes) {
      for (const chapter of volume.chapters) {
        const content = generateChapterContent(novel.title, chapter.title)
        await env.NOVEL_META.put(`chapter:${novel.id}:${chapter.id}`, content)
      }
    }
  }

  await env.NOVEL_META.put('novel:list', JSON.stringify(novelIds))
}
