export type SkillLevel = 'expert' | 'advanced' | 'proficient' | 'learning';

export interface Skill {
  name: string;
  level: SkillLevel;
  years?: number;
  icon?: string;
}

export interface SkillGroup {
  id: string;
  title: string;
  description?: string;
  skills: Skill[];
}
