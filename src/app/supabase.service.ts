import { Injectable } from '@angular/core'
import {
  AuthChangeEvent,
  AuthSession,
  createClient,
  Session,
  SupabaseClient,
  User,
} from '@supabase/supabase-js'
import { environment } from 'src/environments/environment'

export interface Profile {
  id?: string
  username?: string
  clase: string
  power: string
  level: number
  weapon: string
}

export interface Hability {
  id?: string
  name?: string
  description?: string
  clase: string
  power: string
  level: number
  total_uses: number
  current_uses: number
}

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {

  private supabase: SupabaseClient;
  _session: AuthSession | null = null;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey)
  }

  get session() {
    this.supabase.auth.getSession().then(({ data }) => {
      this._session = data.session
    })
    return this._session
  }

  profile(user: User) {
    return this.supabase
      .from('profiles')
      .select(`username, clase, power, level, weapon`)
      .eq('id', user.id)
      .single()
  }

  async getAllHabilities() {
    let { data: habilities, error } = await this.supabase
      .from('habilities')
      .select('*');
      
    return error ? error : habilities;
  }

  async getHabilitiesFromUser(profile: Profile) {
    try {
      let { data: habilities, error } = await this.supabase
      .from('habilities')
      .select('*')
      .lte("level", profile.level)
      .eq("power", profile.power);
      
      return error ? error : habilities;
    } catch(error) {
      return error;
    }
   
  }

  authChanges(callback: (event: AuthChangeEvent, session: Session | null) => void) {
    return this.supabase.auth.onAuthStateChange(callback)
  }

  signIn(email: string, password: string) {
    return this.supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
  }

  signOut() {
    return this.supabase.auth.signOut()
  }

  // Had to fix this manually to work
  async updateProfile(profile: Profile) {

    const update = {
      ...profile,
      updated_at: new Date(),
    }

    return await this.supabase
    .from('profiles')
    .upsert(update)
    .select()
  }
}