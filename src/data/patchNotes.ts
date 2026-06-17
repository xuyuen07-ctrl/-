export interface StatAdjustment {
  stat: string;
  before: string;
  after: string;
}

export interface CharacterPatch {
  characterId: string;
  characterName: string;
  type: 'buff' | 'nerf' | 'adjust';
  title: string;
  description: string;
  details: StatAdjustment[];
}

export interface PatchLog {
  version: string;
  date: string;
  title: string;
  highlights: string[];
  adjustments: CharacterPatch[];
}

export const PATCH_LOGS: PatchLog[] = [
  {
    version: "v1.2.5",
    date: "2026-06-12",
    title: "「重力潮汐與猩紅暗影」平衡性調整",
    highlights: [
      "優化手機端高精圖鑑資訊，複雜傷害數值全面可視化",
      "「吸血猩紅」吸血倍率微調，蓄力冷卻縮短，更流暢地進行突刺",
      "「堅岩大地」地底震盪石柱眩暈時長與冷卻平衡調整",
      "「混沌之骰」命運豪賭效果重塑，提高大彩頭冷卻歸零的可控性",
      "「時空引力」力場重力裂縫減速補償上調"
    ],
    adjustments: [
      {
        characterId: "vampire",
        characterName: "吸血猩紅",
        type: "buff",
        title: "裂牙突刺手感優化與蓄力冷卻提振",
        description: "我們縮短了主技能嗜血絞噬的後搖冷卻，並讓裂牙突刺吸回來的HP能更即時地附加為能量狀態。",
        details: [
          { stat: "蓄力硬直冷卻", before: "2.5秒", after: "2.0秒" },
          { stat: "裂牙突刺冷卻", before: "12.5秒", after: "11.5秒" },
          { stat: "蓄力打斷虚弱時長", before: "2.0秒", after: "1.5秒" }
        ]
      },
      {
        characterId: "mud",
        characterName: "堅岩大地",
        type: "adjust",
        title: "大地崩裂石柱施法判判定調整",
        description: "大地守護在面對高敏捷對手時往往難以命中，我們縮短了石柱破地光環的延遲，作為代價，微調其眩暈時間與基礎體魄。",
        details: [
          { stat: "破地光環延遲", before: "0.6秒", after: "0.45秒" },
          { stat: "大地石柱眩暈", before: "1.0秒", after: "0.85秒" },
          { stat: "初始最大生命值", before: "350 HP", after: "360 HP" }
        ]
      },
      {
        characterId: "dice",
        characterName: "混沌之骰",
        type: "buff",
        title: "命運豪賭輔助增益判定範圍擴散",
        description: "增加了命運隨機點數的影響，讓『3點大彩頭』能高機率額外重置副將的冷卻，大幅增強了雙人協同中的改命上限。",
        details: [
          { stat: "命運豪賭冷卻", before: "9.0秒", after: "8.2秒" },
          { stat: "3點大彩頭觸發概率", before: "33.3%", after: "37.5%" },
          { stat: "隨機極限傷害", before: "4.5 點", after: "4.8點" }
        ]
      },
      {
        characterId: "gravity",
        characterName: "時空引力",
        type: "nerf",
        title: "大半徑引力阻尼微調以優化對抗體驗",
        description: "為了改善中低重力球體在進入其時空羈絆範圍後過於無力的問題，我們微調了引力場的被動減速效果，並同步增加其質量反彈抵抗。",
        details: [
          { stat: "引力光暈移速阻尼", before: "-30%", after: "-25%" },
          { stat: "重力裂縫無敵時間", before: "2.5秒", after: "2.2秒" },
          { stat: "物理反彈位移抵抗", before: "+15%", after: "+20%" }
        ]
      },
      {
        characterId: "blaze",
        characterName: "赤炎烈火",
        type: "buff",
        title: "瞬間爆燃粒子擴散與冷卻平衡",
        description: "我們優化了瞬間爆燃的傷害在內圈的堆疊，讓赤炎烈火在貼身近戰時能爆發出更高的燃燒威力。",
        details: [
          { stat: "內圈灼燒頻率", before: "0.4秒/次", after: "0.3秒/次" },
          { stat: "初始移動速度", before: "1.08x", after: "1.10x" }
        ]
      }
    ]
  },
  {
    version: "v1.2.0",
    date: "2026-05-30",
    title: "「重力失落之戰」重大版本更新",
    highlights: [
      "全新 2V2 協同模式正式實施，主副將輪替在線，解鎖複合彈力被動技",
      "精緻化角色分類框架：堅毅坦克系、獵魔戰士系、奧術法術系等正式確立",
      "全場景物理動態碰撞演算核心升級，彈射極限慣性更加逼真"
    ],
    adjustments: [
      {
        characterId: "lightning",
        characterName: "暴風雷霆",
        type: "adjust",
        title: "天劫狂雷與亂流推力極限縮減",
        description: "為防止電漿在牆壁死角產生無窮大震退阻礙，我們降低了感電擊退的極限瞬時值，並增加了強力亂流風紋的細節品質。",
        details: [
          { stat: "雷擊炸裂範圍", before: "35 px", after: "40 px" },
          { stat: "亂流最大吹射力", before: "12 點推速", after: "10 點推速" }
        ]
      }
    ]
  }
];
