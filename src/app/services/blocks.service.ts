import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BlocksService {


  baseMediaUrl = environment.baseMediaUrl;
  baseCacheUrl = environment.externalCacheurl;

  constructor(
    private http: HttpClient,
    private messages: MessageService
  ) { }

  async blockUser(id: string): Promise<boolean> {
    let success = false;
    try {
      const formData = {
        userId: id
      }
      const response = await this.http.post(`${environment.baseUrl}/block`, formData).toPromise();
      this.messages.add({ severity: 'success', summary: 'You blocked this user.' });
      success = true;
    } catch (error) {
      console.error(error)
      this.messages.add({ severity: 'error', summary: 'Something went wrong blocking the user! Check your internet conectivity and try again.' });
    }
    return success;
  }

  processResponse(serverResponse: Array<any>, key: string) {
    return serverResponse.map(userBlocked => {
      return {
        avatar: userBlocked[key].url.startsWith('@') ? this.baseCacheUrl + encodeURIComponent(userBlocked[key].avatar) : this.baseMediaUrl + userBlocked[key].avatar,
        url: userBlocked[key].url = userBlocked[key].url,
        reason: userBlocked.reason,
        id: userBlocked[key].id
      }
    });
  }
  async getBlockList(): Promise<Array<any>> {
    const response = await this.http.get<Array<any>>(`${environment.baseUrl}/myBlocks`).toPromise();
    return response ? this.processResponse(response, 'blocked') : [];
  }

  async unblockUser(id: string): Promise<Array<any>> {
    const response = await this.http.post<Array<any>>(`${environment.baseUrl}/unblock-user?id=${encodeURIComponent(id)}`, {}).toPromise();
    return response ? this.processResponse(response, 'blocked') : [];
  }


  async muteUser(id: string): Promise<boolean> {
    let success = false;
    try {
      const formData = {
        userId: id
      }
      const response = await this.http.post(`${environment.baseUrl}/mute`, formData).toPromise();
      this.messages.add({ severity: 'success', summary: 'You muted this user' });

      success = true;
    } catch (error) {
      console.error(error)
      this.messages.add({ severity: 'error', summary: 'Something went wrong blocking the user! Check your internet conectivity and try again.' });
    }
    return success;
  }
  async getMuteList(): Promise<Array<any>> {
    const response = await this.http.get<Array<any>>(`${environment.baseUrl}/myMutes`).toPromise();
    return response ? this.processResponse(response, 'muted') : [];
  }

  async unmuteUser(id: string): Promise<Array<any>> {
    const response = await this.http.post<Array<any>>(`${environment.baseUrl}/unmute-user?id=${encodeURIComponent(id)}`, {}).toPromise();
    return response ? this.processResponse(response, 'muted') : [];
  }

  async blockServer(id: string): Promise<boolean> {
    let success = false;
    try {
      const formData = {
        userId: id
      }
      const response = await this.http.post(`${environment.baseUrl}/blockUserServer`, formData).toPromise();
      this.messages.add({ severity: 'success', summary: 'You blocked this server' });

      success = true;
    } catch (error) {
      console.error(error)
      this.messages.add({ severity: 'error', summary: 'Something went wrong blocking the server! Check your internet conectivity and try again.' });
    }
    return success;
  }
  async getMyServerBlockList(): Promise<Array<any>> {
    const response = await this.http.get<Array<any>>(`${environment.baseUrl}/myServerBlocks`).toPromise();
    return response ? this.processResponse(response, 'server') : [];
  }

  async unblockServer(id: string): Promise<Array<any>> {
    const response = await this.http.post<Array<any>>(`${environment.baseUrl}/unblockServer?displayName=${encodeURIComponent(id)}`, {}).toPromise();
    return response ? this.processResponse(response, 'server') : [];
  }
}
